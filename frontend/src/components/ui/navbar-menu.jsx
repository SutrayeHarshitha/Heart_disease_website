"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Menu = ({
  children,
  setActive
}) => {
  return (
    <nav className="relative rounded-full border border-transparent bg-white/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-[8px] dark:border-white/[0.2] dark:bg-black/60">
      <ul className="flex items-center gap-4 px-8 py-4">
        {children}
      </ul>
    </nav>
  );
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children
}) => {
  return (
    <li
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)}
      className="relative rounded-lg p-2 text-gray-700 hover:text-indigo-600 dark:text-neutral-50"
    >
      <span className="cursor-pointer text-sm font-medium">{item}</span>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-full pt-4"
        >
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-800">
            {children}
          </div>
        </motion.div>
      )}
    </li>
  );
};

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400 transition-colors"
    >
      {children}
    </Link>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src
}) => {
  return (
    <Link to={href} className="flex space-x-2">
      <img
        src={src}
        alt={title}
        className="flex-shrink-0 h-[60px] w-[60px] rounded-md object-cover"
      />
      <div>
        <h3 className="font-medium text-neutral-700 dark:text-neutral-200">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
    </Link>
  );
} 