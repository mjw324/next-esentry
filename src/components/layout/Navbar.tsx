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
  const pathname = usePathname(); // Detect the current URL path
  // Open state for the dropdown and hamburger icon
  const [opened, setOpened] = useState(false);

  const [isDashboard, setIsDashboard] = useState(false);
  // Detection for any subroute of '/dashboard'
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

        {isDashboard ? (
          <>
            {/* Dropdown Menu with Hamburger Icon */}
            <NavbarItem>
              <Dropdown
                placement="bottom-end"
                showArrow
                offset={10}
                classNames={{
                  base: "bg-white dark:bg-gray-800 text-black dark:text-white",
                }}
              >
                <DropdownTrigger>
                  <Button isIconOnly variant="light" aria-label="Menu">
                    <HamburgerIcon opened={opened} setOpened={setOpened} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Dashboard Navigation"
                  variant="flat"
                  color="secondary"
                >
                  <DropdownItem key="dashboard">
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownItem>
                  <DropdownItem key="create-monitor">
                    <Link href="/dashboard/create-monitor">Create Monitor</Link>
                  </DropdownItem>
                  <DropdownItem key="check-item">
                    <Link href="/dashboard/check-item">Check Item</Link>
                  </DropdownItem>
                  <DropdownItem key="account-settings">
                    <Link href="/dashboard/account-settings">
                      Account Settings
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="logout">
                    <Link href="/logout">Logout</Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
      </NavbarContent>
    </NextUINavbar>
  );
};
