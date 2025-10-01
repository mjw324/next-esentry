// https://github.com/adobe/react-spectrum/discussions/5030
// Collection components like Dropdown have to be rendered as client for now until fixed
"use client";

import { useSession, signOut } from "@/lib/auth-client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function NavbarDropdown() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          avatarProps={{
            src: session?.user?.image ?? "/img/user.png",
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
        <DropdownItem
          key="dashboard"
          className={
            pathname === "/dashboard"
              ? "bg-primary-200 text-primary-600 font-medium"
              : ""
          }
        >
          <Link href="/dashboard">Dashboard</Link>
        </DropdownItem>
        <DropdownItem
          key="settings"
          className={
            pathname === "/dashboard/preferences"
              ? "bg-secondary-200 text-secondary-600 font-medium"
              : ""
          }
        >
          <Link href="/dashboard/preferences">Alert Preferences</Link>
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onPress={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login");
                },
              },
            })
          }
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
