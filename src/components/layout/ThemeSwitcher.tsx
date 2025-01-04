"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Expand.css";
import { Expand } from "@theme-toggles/react";
import { Skeleton } from "@nextui-org/react";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = resolvedTheme === "dark";

  if (!mounted) {
    return <Skeleton className="w-6 h-6 rounded-full" />;
  }

  return (
    <div className="flex items-center">
      <Expand
        toggled={isDarkTheme}
        toggle={() => setTheme(isDarkTheme ? "light" : "dark")}
        duration={750}
        className="rounded-full focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20 text-2xl dark:text-white text-black"
        placeholder="Toggle theme"
        aria-label="Toggle theme"
      />
    </div>
  );
};

export default ThemeChanger;
