"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Disclosure } from "@headlessui/react";
import { Button } from "@nextui-org/react";

export const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.Fragment>
      <div className="w-full">
        <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
          {/* Logo */}
          <Disclosure>
            {({ open }) => (
              <>
                <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                  <Link href="/">
                    <span className="flex items-center space-x-2 text-2xl font-medium text-emerald-500 dark:text-gray-100">
                      <span>
                        <Image
                          src={
                            mounted &&
                            (theme === "dark" || resolvedTheme === "dark")
                              ? "/img/esentry-name-icon-dark.svg"
                              : "/img/esentry-name-icon-light.svg"
                          }
                          alt="eSentry Logo"
                          width={192}
                          height={48}
                          className="w-48"
                        />
                      </span>
                    </span>
                  </Link>
                </div>
              </>
            )}
          </Disclosure>

          <div className="hidden mr-3 space-x-4 lg:flex nav__item">
            <Link href="/login">
              <Button className="px-4 py-4 text-sm font-medium text-center text-white bg-emerald-600 rounded-md">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="px-4 py-4 text-sm font-medium text-center text-white bg-emerald-600 rounded-md">
                Register
              </Button>
            </Link>

            <ThemeChanger />
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
};
