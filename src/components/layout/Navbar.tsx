"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import ThemeChanger from "@/components/layout/ThemeSwitcher";
import Image from "next/image";

export const Navbar = () => {
  const pathname = usePathname(); // Detect the current URL path

  const isDashboard = pathname === "/dashboard";

  return (
    <NextUINavbar
      isBordered={false}
      isBlurred={true}
      maxWidth="full"
      classNames={{
        base: "container px-8 mx-auto xl:px-0",
      }}
    >
      {/* Brand section */}
      <NavbarBrand>
        <Link href="/">
          <Image
            className="block dark:hidden"
            src="/img/esentry-name-icon-light.svg"
            alt="eSentry Logo"
            width={140}
            height={48}
          />
          <Image
            className="hidden dark:block"
            src="/img/esentry-name-icon-dark.svg"
            alt="eSentry Logo"
            width={140}
            height={8}
          />
        </Link>
      </NavbarBrand>

      {/* Conditionally render content based on the page */}
      <NavbarContent justify="end">
        {isDashboard ? (
          <>
            <NavbarItem>
              <Link href="/dashboard/settings">
                <Button>Settings</Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/dashboard/profile">
                <Button>Profile</Button>
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link href="/login">
                <Button className="bg-gradient-to-tr dark:to-green-600 dark:from-cyan-600 to-green-400 from-cyan-400 dark:text-white text-black font-medium shadow-lg">
                  Login
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/register">
                <Button className="bg-gradient-to-tr dark:from-green-600 dark:to-cyan-600 to-green-400 from-cyan-400 dark:text-white text-black font-medium shadow-lg">
                  Register
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}

        {/* Theme Switcher for all pages */}
        <NavbarItem>
          <ThemeChanger />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
