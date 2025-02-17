// https://github.com/adobe/react-spectrum/discussions/5030
// Collection components like Dropdown have to be rendered as client for now until fixed
"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import Link from "next/link";

export function NavbarDropdown() {
  const { data: session } = useSession();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          avatarProps={{
            src: session?.user?.image ?? "",
            isBordered: true,
            size: "sm",
            color: "primary",
          }}
          as="button"
          className="transition-transform"
          name={session?.user?.name ?? ""}
          description={session?.user?.email}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session?.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="dashboard">
          <Link href="/dashboard">Dashboard</Link>
        </DropdownItem>
        <DropdownItem key="settings">
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
