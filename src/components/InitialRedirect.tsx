"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function InitialRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleInitialRedirect = async () => {
      // Check if we've already performed the initial redirect in this session
      if (sessionStorage.getItem("initialRedirectDone")) {
        return;
      }

      try {
        const { data: session } = authClient.useSession();
        if (session?.user) {
          // Mark that we've done the initial redirect
          sessionStorage.setItem("initialRedirectDone", "true");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    handleInitialRedirect();
  }, [router]);

  return null;
}
