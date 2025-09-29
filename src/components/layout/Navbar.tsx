"use client";
import Link from "next/link";
import {
  Button,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Skeleton,
} from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { useServerSession } from "@/app/providers";
import ThemeChanger from "@/components/layout/ThemeSwitcher";
import Image from "next/image";
import { NavbarDropdown } from "./NavbarDropdown";

export function Navbar() {
  const { data: clientSession, isPending } = useSession();
  const serverSession = useServerSession();

  // Use server session as fallback while client session loads
  const session = clientSession || serverSession;
  const isLoading = isPending && !serverSession;

  // Show loading skeleton only if no server fallback available
  if (isLoading) {
    return (
      <NextUINavbar
        isBordered={false}
        isBlurred={true}
        maxWidth="full"
        classNames={{
          base: "container mx-auto xl:px-0",
        }}
      >
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
        <NavbarContent justify="end" className="gap-4">
          <NavbarItem>
            <ThemeChanger />
          </NavbarItem>
          <NavbarItem>
            <Skeleton className="w-16 h-8 rounded-lg">
              <div className="w-16 h-8 bg-default-300" />
            </Skeleton>
          </NavbarItem>
        </NavbarContent>
      </NextUINavbar>
    );
  }

  return (
    <NextUINavbar
      isBordered={false}
      isBlurred={true}
      maxWidth="full"
      classNames={{
        base: "container mx-auto xl:px-0",
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
                <Button color="primary" className="font-semibold">
                  Login
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/register">
                <Button color="primary" className="font-semibold">
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
