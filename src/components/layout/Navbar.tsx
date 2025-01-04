"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import ThemeChanger from "@/components/layout/ThemeSwitcher";
import Image from "next/image";
import { HamburgerIcon } from "@/svg_components/HamburgerIcon";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname.startsWith("/dashboard"));
  }, [pathname]);

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
        <Link href={isDashboard ? "/dashboard" : "/"}>
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
            height={48}
          />
        </Link>
      </NavbarBrand>
      {/* Navbar Content */}
      <NavbarContent justify="end">
        {/* Theme Switcher */}
        <NavbarItem>
          <ThemeChanger />
        </NavbarItem>
        {!isDashboard && (
          <>
            <NavbarItem>
              <Link href="/login">
                <Button className="bg-gradient-to-tr dark:to-success-400 dark:from-primary to-success-300 from-primary-300 dark:text-white text-black font-medium shadow-lg">
                  Login
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/register">
                <Button className="bg-gradient-to-tr dark:from-success-400 dark:to-primary to-success-300 from-primary-300 dark:text-white text-black font-medium shadow-lg">
                  Register
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
