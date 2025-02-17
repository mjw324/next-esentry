"use client";
import Link from "next/link";
import {
  Button,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import ThemeChanger from "@/components/layout/ThemeSwitcher";
import Image from "next/image";
import { NavbarDropdown } from "./NavbarDropdown";

export function Navbar() {
  const { data: session } = useSession();

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
            height={48}
          />
        </Link>
      </NavbarBrand>

      {/* Navbar Content */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <ThemeChanger />
        </NavbarItem>

        {session ? (
          <NavbarItem>
            <NavbarDropdown />
          </NavbarItem>
        ) : (
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
}
