from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import logging
import os
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import certifi

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # Your frontend origin
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"],
        "max_age": 3600
    }
})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Max-Age', '3600')
    return response

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# JWT Configuration
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key

# MongoDB Configuration
try:
    # MongoDB Atlas connection string with URL-encoded credentials and auth source
    MONGODB_URI = "mongodb+srv://Harshitha:harshitha14@cluster0.tjcny.mongodb.net/heart_disease_db?authSource=admin&retryWrites=true&w=majority&serverSelectionTimeoutMS=30000&connectTimeoutMS=30000&socketTimeoutMS=30000"
    
    # Connect to MongoDB Atlas with enhanced configuration
    mongo_client = MongoClient(
        MONGODB_URI,
        tlsCAFile=certifi.where(),
        connect=True,
        retryWrites=True,
        authSource='admin'  # Explicitly specify the authentication database
    )
    
    # Test the connection with increased timeout and explicit auth source
    mongo_client.admin.command('ping', serverSelectionTimeoutMS=30000)
    
    # Get database and collections
    db = mongo_client['heart_disease_db']
    users_collection = db['users']
    predictions_collection = db['predictions']
    
    # Create indexes
    users_collection.create_index('email', unique=True)
    predictions_collection.create_index([('user_id', 1), ('timestamp', -1)])
    predictions_collection.create_index('risk_level')
    
    logger.info("MongoDB Atlas connected successfully")
    logger.info(f"Connected to database: {db.name}")
    logger.info(f"Collections: {db.list_collection_names()}")
    
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    logger.error("Authentication failed. Please verify your MongoDB Atlas username and password.")
    logger.error("Make sure your MongoDB Atlas user has the correct permissions.")
    db = None
    users_collection = None
    predictions_collection = None
    raise Exception("Failed to connect to MongoDB. Application cannot start without database connection. Error: " + str(e))

# Initialize global variables for model and scaler
model = None
scaler = None

def load_model():
    global model, scaler
    try:
        # Check if model exists, if not, train it
        if not os.path.exists('model/heart_model.pkl'):
            logger.info("Training new model...")
            train_model()
        
        logger.info("Loading model and scaler...")
        model = joblib.load('model/heart_model.pkl')
        scaler = joblib.load('model/scaler.pkl')
        logger.info("Model and scaler loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def train_model():
    try:
        logger.info("Loading training data...")
        # Load your dataset
        data = pd.read_csv('data/heart.csv')  # Make sure to have this file
        
        # Prepare features and target
        X = data.drop('target', axis=1)  # Adjust column name as per your dataset
        y = data['target']
        
        # Initialize and fit the scaler
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train the model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Create model directory if it doesn't exist
        os.makedirs('model', exist_ok=True)
        
        # Save the model and scaler
        joblib.dump(model, 'model/heart_model.pkl')
        joblib.dump(scaler, 'model/scaler.pkl')
        logger.info("Model trained and saved successfully")
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise

# Test endpoint to verify server is running
@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'Flask server is running'
    })

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({
                'error': 'Email already registered',
                'success': False
            }), 400
        
        # Create new user document
        new_user = {
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'name': data['name'],
            'created_at': datetime.datetime.utcnow(),
            'predictions': []
        }
        
        # Insert user into database
        result = users_collection.insert_one(new_user)
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'email': data['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'email': data['email'],
                'name': data['name']
            }
        })
        
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'error': 'Email and password are required',
                'success': False
            }), 400
        
        # Find user
        user = users_collection.find_one({'email': data['email']})
        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({
                'error': 'Invalid email or password',
                'success': False
            }), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name']
            }
        })
        
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Middleware to verify JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        logger.debug(f"Received Authorization header: {token}")
        
        if not token:
            logger.error("No token provided in request")
            return jsonify({
                'error': 'Token is missing',
                'success': False
            }), 401
        
        try:
            # Check if token has correct format
            if not token.startswith('Bearer '):
                logger.error("Token does not start with 'Bearer '")
                return jsonify({
                    'error': 'Invalid token format',
                    'success': False
                }), 401
            
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            logger.debug("Attempting to decode token")
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            logger.debug(f"Token decoded successfully: {data}")
            
            # Verify user exists in database
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                logger.error(f"No user found for ID: {data['user_id']}")
                return jsonify({
                    'error': 'User not found',
                    'success': False
                }), 401
                
            logger.info(f"User authenticated successfully: {current_user['email']}")
            return f(current_user, *args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return jsonify({
                'error': 'Token has expired',
                'success': False
            }), 401
        except jwt.InvalidTokenError:
            logger.error("Invalid token")
            return jsonify({
                'error': 'Invalid token',
                'success': False
            }), 401
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            logger.exception("Full traceback:")
            return jsonify({
                'error': 'Authentication failed',
                'success': False
            }), 401
    
    return decorated

# Update the predict endpoint to save predictions to user history
@app.route('/predict', methods=['POST'])
@token_required
def predict(current_user):
    try:
        logger.info("Received prediction request")
        data = request.get_json()
        
        if not data:
            logger.error("No data received")
            return jsonify({
                'error': 'No data received',
                'success': False
            }), 400
            
        logger.debug(f"Received data: {data}")
        
        # Extract features from the request
        required_fields = ['age', 'gender', 'chestPain', 'restingBP', 'cholesterol', 
                         'fastingBS', 'restingECG', 'maxHR', 'smoking', 'obesity']
        
        # Check if all required fields are present
        for field in required_fields:
            if field not in data:
                logger.error(f"Missing required field: {field}")
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Extract and preprocess features
        features = np.array([
            data['age'],
            data['gender'],
            encode_chest_pain(data['chestPain']),
            data['restingBP'],
            data['cholesterol'],
            data['fastingBS'],
            encode_resting_ecg(data['restingECG']),
            data['maxHR'],
            data['smoking'],
            data['obesity']
        ]).reshape(1, -1)
        
        logger.debug(f"Processed features: {features}")
        
        # Scale the features
        if scaler is None:
            load_model()
        
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        prediction_proba = model.predict_proba(features_scaled)[0]
        
        logger.info(f"Prediction result: {prediction}")
        logger.debug(f"Prediction probabilities: {prediction_proba}")
        
        # Create prediction record with detailed information
        prediction_record = {
            'user_id': current_user['_id'],
            'user_name': current_user['name'],
            'user_email': current_user['email'],
            'input_data': {
                'age': data['age'],
                'gender': 'male' if data['gender'] == 1 else 'female',
                'chestPain': data['chestPain'],
                'restingBP': data['restingBP'],
                'cholesterol': data['cholesterol'],
                'fastingBS': 'yes' if data['fastingBS'] == 1 else 'no',
                'restingECG': data['restingECG'],
                'maxHR': data['maxHR'],
                'smoking': 'yes' if data['smoking'] == 1 else 'no',
                'obesity': 'yes' if data['obesity'] == 1 else 'no'
            },
            'prediction': int(prediction),
            'probability': float(prediction_proba[1]),
            'timestamp': datetime.datetime.utcnow(),
            'risk_level': 'High' if prediction == 1 else 'Low'
        }
        
        # Insert prediction into database
        result = predictions_collection.insert_one(prediction_record)
        
        # Update user's predictions array with the new prediction ID
        users_collection.update_one(
            {'_id': current_user['_id']},
            {'$push': {'predictions': result.inserted_id}}
        )
        
        return jsonify({
            'prediction': int(prediction),
            'probability': float(prediction_proba[1]),
            'user_name': current_user['name'],
            'user_email': current_user['email'],
            'risk_level': 'High' if prediction == 1 else 'Low',
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

@app.route('/user/predictions', methods=['GET'])
@token_required
def get_user_predictions(current_user):
    try:
        logger.info(f"Fetching predictions for user: {current_user['email']}")
        logger.debug(f"User ID: {current_user['_id']}")
        
        # Validate user object
        if not current_user.get('_id'):
            logger.error("User ID is missing")
            return jsonify({
                'error': 'Invalid user data',
                'success': False
            }), 400

        # Get predictions sorted by timestamp in descending order (newest first)
        try:
            predictions = predictions_collection.find(
                {'user_id': current_user['_id']}
            ).sort('timestamp', -1)
            
            # Convert cursor to list and log the count
            predictions_list = list(predictions)
            logger.info(f"Found {len(predictions_list)} predictions for user")
            logger.debug(f"Raw predictions: {predictions_list}")
            
            # Format predictions for response
            formatted_predictions = []
            for pred in predictions_list:
                try:
                    formatted_pred = {
                        'id': str(pred['_id']),
                        'input_data': pred['input_data'],
                        'prediction': pred['prediction'],
                        'probability': pred['probability'],
                        'risk_level': pred['risk_level'],
                        'user_name': pred['user_name'],
                        'user_email': pred['user_email'],
                        'timestamp': pred['timestamp'].isoformat()
                    }
                    formatted_predictions.append(formatted_pred)
                except Exception as format_error:
                    logger.error(f"Error formatting prediction: {format_error}")
                    logger.error(f"Problematic prediction data: {pred}")
                    continue
            
            response_data = {
                'success': True,
                'predictions': formatted_predictions
            }
            
            logger.info("Successfully prepared predictions response")
            logger.debug(f"Response data: {response_data}")
            return jsonify(response_data)
            
        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            return jsonify({
                'error': 'Failed to fetch predictions from database',
                'success': False
            }), 400
        
    except Exception as e:
        logger.error(f"Error fetching predictions: {str(e)}")
        logger.exception("Full traceback:")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

@app.route('/user/predictions/<prediction_id>', methods=['DELETE', 'OPTIONS'])
@token_required
def delete_prediction(current_user, prediction_id):
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        return response, 200

    try:
        logger.info(f"Attempting to delete prediction {prediction_id} for user: {current_user['email']}")
        
        # Validate prediction ID format
        try:
            prediction_obj_id = ObjectId(prediction_id)
        except:
            logger.error(f"Invalid prediction ID format: {prediction_id}")
            return jsonify({
                'error': 'Invalid prediction ID format',
                'success': False
            }), 400

        # Find the prediction
        prediction = predictions_collection.find_one({
            '_id': prediction_obj_id,
            'user_id': current_user['_id']
        })
        
        if not prediction:
            logger.error(f"Prediction {prediction_id} not found or does not belong to user")
            return jsonify({
                'error': 'Prediction not found',
                'success': False
            }), 404
        
        # Delete the prediction
        result = predictions_collection.delete_one({
            '_id': prediction_obj_id,
            'user_id': current_user['_id']
        })
        
        if result.deleted_count == 0:
            logger.error("Failed to delete prediction")
            return jsonify({
                'error': 'Failed to delete prediction',
                'success': False
            }), 400
        
        # Remove prediction ID from user's predictions array
        users_collection.update_one(
            {'_id': current_user['_id']},
            {'$pull': {'predictions': prediction_obj_id}}
        )
        
        logger.info(f"Successfully deleted prediction {prediction_id}")
        response = jsonify({
            'success': True,
            'message': 'Prediction deleted successfully'
        })
        
        # Add CORS headers to the response
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        
        return response
        
    except Exception as e:
        logger.error(f"Error deleting prediction: {str(e)}")
        logger.exception("Full traceback:")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

def encode_chest_pain(chest_pain):
    mapping = {
        'typical': 0,
        'atypical': 1,
        'nonanginal': 2,
        'asymptomatic': 3
    }
    return mapping.get(chest_pain, 0)

def encode_resting_ecg(resting_ecg):
    mapping = {
        'normal': 0,
        'st-t': 1,
        'lv': 2
    }
    return mapping.get(resting_ecg, 0)

# Load the model when the server starts
try:
    load_model()
except Exception as e:
    logger.error(f"Error during initial model loading: {str(e)}")

# Get all predictions (admin only)
@app.route('/admin/predictions', methods=['GET'])
@token_required
def get_all_predictions(current_user):
    try:
        # Check if user is admin (you can add an is_admin field to your user model)
        if not current_user.get('is_admin', False):
            return jsonify({
                'error': 'Unauthorized access',
                'success': False
            }), 403

        predictions = list(predictions_collection.find())
        
        # Convert ObjectId to string for JSON serialization
        for pred in predictions:
            pred['_id'] = str(pred['_id'])
            pred['user_id'] = str(pred['user_id'])
            if 'timestamp' in pred:
                pred['timestamp'] = pred['timestamp'].isoformat()

        return jsonify({
            'success': True,
            'predictions': predictions
        })

    except Exception as e:
        logger.error(f"Error fetching all predictions: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Get a single prediction by ID
@app.route('/predictions/<prediction_id>', methods=['GET'])
@token_required
def get_prediction(current_user, prediction_id):
    try:
        # Validate prediction ID format
        try:
            prediction_obj_id = ObjectId(prediction_id)
        except:
            return jsonify({
                'error': 'Invalid prediction ID format',
                'success': False
            }), 400

        # Find the prediction
        prediction = predictions_collection.find_one({
            '_id': prediction_obj_id,
            'user_id': current_user['_id']
        })

        if not prediction:
            return jsonify({
                'error': 'Prediction not found',
                'success': False
            }), 404

        # Convert ObjectId to string for JSON serialization
        prediction['_id'] = str(prediction['_id'])
        prediction['user_id'] = str(prediction['user_id'])
        if 'timestamp' in prediction:
            prediction['timestamp'] = prediction['timestamp'].isoformat()

        return jsonify({
            'success': True,
            'prediction': prediction
        })

    except Exception as e:
        logger.error(f"Error fetching prediction: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Update a prediction
@app.route('/predictions/<prediction_id>', methods=['PUT'])
@token_required
def update_prediction(current_user, prediction_id):
    try:
        # Validate prediction ID format
        try:
            prediction_obj_id = ObjectId(prediction_id)
        except:
            return jsonify({
                'error': 'Invalid prediction ID format',
                'success': False
            }), 400

        # Find the prediction
        prediction = predictions_collection.find_one({
            '_id': prediction_obj_id,
            'user_id': current_user['_id']
        })

        if not prediction:
            return jsonify({
                'error': 'Prediction not found',
                'success': False
            }), 404

        # Get update data from request
        update_data = request.get_json()
        
        # Remove fields that shouldn't be updated
        update_data.pop('_id', None)
        update_data.pop('user_id', None)
        update_data.pop('timestamp', None)

        # Update the prediction
        result = predictions_collection.update_one(
            {
                '_id': prediction_obj_id,
                'user_id': current_user['_id']
            },
            {'$set': update_data}
        )

        if result.modified_count == 0:
            return jsonify({
                'error': 'No changes made to prediction',
                'success': False
            }), 400

        # Get updated prediction
        updated_prediction = predictions_collection.find_one({
            '_id': prediction_obj_id,
            'user_id': current_user['_id']
        })

        # Convert ObjectId to string for JSON serialization
        updated_prediction['_id'] = str(updated_prediction['_id'])
        updated_prediction['user_id'] = str(updated_prediction['user_id'])
        if 'timestamp' in updated_prediction:
            updated_prediction['timestamp'] = updated_prediction['timestamp'].isoformat()

        return jsonify({
            'success': True,
            'message': 'Prediction updated successfully',
            'prediction': updated_prediction
        })

    except Exception as e:
        logger.error(f"Error updating prediction: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Delete a prediction (already exists, but adding a bulk delete endpoint)
@app.route('/predictions/bulk-delete', methods=['POST'])
@token_required
def bulk_delete_predictions(current_user):
    try:
        data = request.get_json()
        prediction_ids = data.get('prediction_ids', [])

        if not prediction_ids:
            return jsonify({
                'error': 'No prediction IDs provided',
                'success': False
            }), 400

        # Convert string IDs to ObjectId
        try:
            prediction_obj_ids = [ObjectId(pid) for pid in prediction_ids]
        except:
            return jsonify({
                'error': 'Invalid prediction ID format',
                'success': False
            }), 400

        # Delete predictions
        result = predictions_collection.delete_many({
            '_id': {'$in': prediction_obj_ids},
            'user_id': current_user['_id']
        })

        # Remove prediction IDs from user's predictions array
        users_collection.update_one(
            {'_id': current_user['_id']},
            {'$pull': {'predictions': {'$in': prediction_obj_ids}}}
        )

        return jsonify({
            'success': True,
            'message': f'Successfully deleted {result.deleted_count} predictions'
        })

    except Exception as e:
        logger.error(f"Error bulk deleting predictions: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Get predictions with pagination and filtering
@app.route('/predictions', methods=['GET'])
@token_required
def get_filtered_predictions(current_user):
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        risk_level = request.args.get('risk_level')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        # Build query
        query = {'user_id': current_user['_id']}
        
        if risk_level:
            query['risk_level'] = risk_level
            
        if start_date or end_date:
            query['timestamp'] = {}
            if start_date:
                query['timestamp']['$gte'] = datetime.datetime.fromisoformat(start_date)
            if end_date:
                query['timestamp']['$lte'] = datetime.datetime.fromisoformat(end_date)

        # Get total count
        total = predictions_collection.count_documents(query)

        # Get paginated predictions
        predictions = list(predictions_collection.find(query)
                         .sort('timestamp', -1)
                         .skip((page - 1) * per_page)
                         .limit(per_page))

        # Convert ObjectId to string for JSON serialization
        for pred in predictions:
            pred['_id'] = str(pred['_id'])
            pred['user_id'] = str(pred['user_id'])
            if 'timestamp' in pred:
                pred['timestamp'] = pred['timestamp'].isoformat()

        return jsonify({
            'success': True,
            'predictions': predictions,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            }
        })

    except Exception as e:
        logger.error(f"Error fetching filtered predictions: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

# Handle OPTIONS requests
@app.route('/user/predictions/<prediction_id>', methods=['OPTIONS'])
def handle_options(prediction_id):
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Max-Age', '3600')
    return response, 200

if __name__ == '__main__':
    # Run the server on all available network interfaces
    app.run(host='0.0.0.0', port=5000, debug=True) 