"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@nextui-org/react";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure the component is mounted before rendering
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 500); // Simulating loading delay of 0.5s for demonstration
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center">
      {!mounted ? (
        <Skeleton className="w-6 h-6 rounded-full" />
      ) : (
        <button
          onClick={toggleTheme}
          className="theme-toggle text-gray-500 rounded-full outline-none focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20"
          type="button"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          <span className="sr-only">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>

          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.svg
                key="sun"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="1em"
                height="1em"
                fill="currentColor"
                className="theme-toggle__expand w-6 h-6"
                viewBox="0 0 32 32"
                initial={{ rotate: 180, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -180, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <clipPath id="theme-toggle__expand__cutout">
                  <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
                </clipPath>
                <g clipPath="url(#theme-toggle__expand__cutout)">
                  <circle cx="16" cy="16" r="8.4" />
                  <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
                </g>
              </motion.svg>
            ) : (
              <motion.svg
                key="moon"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <path d="M17.293 13.293A8 8 0 116.707 2.707a8.001 8.001 0 0010.586 10.586z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
};

export default ThemeChanger;
