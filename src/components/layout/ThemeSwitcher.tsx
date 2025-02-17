"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Expand } from "@theme-toggles/react";
import { Skeleton } from "@heroui/react";

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
      {/*@ts-ignore*/}
      <Expand
        toggled={isDarkTheme}
        toggle={() => setTheme(isDarkTheme ? "light" : "dark")}
        className="rounded-full focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20 text-2xl dark:text-white text-black"
        aria-label="Toggle theme"
        title="Toggle theme"
        forceMotion={true}
      />
    </div>
  );
};

export default ThemeChanger;
