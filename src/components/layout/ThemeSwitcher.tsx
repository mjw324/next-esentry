"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Expand } from "@theme-toggles/react";
import { Skeleton } from "@nextui-org/react";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Ensure that component only renders on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = resolvedTheme === "dark";
  const handleToggle = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  if (!mounted) {
    return <Skeleton className="w-6 h-6 rounded-full" />;
  }

  return (
    <div className="flex items-center">
      <Expand
        toggled={isDarkTheme}
        toggle={handleToggle}
        aria-label="Toggle theme"
        forceMotion={true}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="rounded-full focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20 text-2xl dark:text-white text-black"
      />
    </div>
  );
};

export default ThemeChanger;
