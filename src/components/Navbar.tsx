'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeChanger from './DarkSwitch';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Disclosure } from '@headlessui/react';
import { Button } from '@nextui-org/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Bars3Icon } from '@heroicons/react/24/solid';

export const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.Fragment>
      <div className="w-full">
        <nav className="container relative flex items-center justify-between p-8 mx-auto">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center space-x-2 text-2xl font-medium text-emerald-500 dark:text-gray-100">
                <span>
                  <Image
                    src={
                      mounted && (theme === 'dark' || resolvedTheme === 'dark')
                        ? '/img/esentry-name-icon-dark.svg'
                        : '/img/esentry-name-icon-light.svg'
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

          {/* Hamburger dropdown on the right for small screens */}
          <div className="flex items-center lg:hidden">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light"><Bars3Icon /></Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="login">
                  <Link href="/login">
                    <Button className="w-full text-sm font-semibold text-center text-white bg-emerald-600 rounded-md">
                      Login
                    </Button>
                  </Link>
                </DropdownItem>
                <DropdownItem key="register">
                  <Link href="/register">
                    <Button className="w-full text-sm font-semibold text-center text-white bg-emerald-600 rounded-md">
                      Register
                    </Button>
                  </Link>
                </DropdownItem>
                <DropdownItem key="themeChanger" className="justify-center">
                  <div className="w-full flex justify-center">
                    <ThemeChanger />
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Login/Register buttons and ThemeChanger on the right for large screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button className="px-4 py-4 text-sm font-semibold text-center text-white bg-emerald-600 rounded-md">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="px-4 py-4 text-sm font-semibold text-center text-white bg-emerald-600 rounded-md">
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
