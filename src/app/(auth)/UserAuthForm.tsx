"use client";

import { Button, Input } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Github from "@/svg_components/Github";
import Google from "@/svg_components/Google";
import LogInSquare from "@/svg_components/LogInSquare";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { z } from "zod";

const emailSchema = z.string().trim().email();

export function UserAuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    email: false,
    github: false,
    google: false,
  });

  const areButtonsDisabled = loading.email || loading.github || loading.google;

  // Use /dashboard as the default callback URL after successful sign-in
  const callbackUrl = "/dashboard";

  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  const submitEmail = useCallback(async () => {
    setLoading((prev) => ({
      ...prev,
      email: true,
    }));

    const validateEmail = emailSchema.safeParse(email);
    if (validateEmail.success) {
      const signInResult = await signIn("email", {
        email: email.toLowerCase(),
        redirect: false,
        callbackUrl,
      });

      setLoading((prev) => ({
        ...prev,
        email: false,
      }));

      if (!signInResult?.ok) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Email Sent! Please check your email to sign in.");
    } else {
      setInputError(validateEmail.error.issues[0].message);
      setLoading((prev) => ({
        ...prev,
        email: false,
      }));
    }
  }, [email, callbackUrl]);

  const signInWithProvider = useCallback(
    (provider: "github" | "google") => async () => {
      setLoading((prev) => ({
        ...prev,
        [provider]: true,
      }));
      const signInResult = await signIn(provider, {
        callbackUrl, // Redirect to dashboard after successful sign-in
      });
      setLoading((prev) => ({
        ...prev,
        [provider]: false,
      }));

      if (signInResult?.error) {
        toast.error("Something went wrong");
      }
    },
    [callbackUrl]
  );

  return (
    <>
      <ToastContainer />
      <div className="mb-4">
        <Input
          value={email}
          onChange={onEmailChange}
          label="Email"
          placeholder="Enter your email"
          isInvalid={inputError == "error"}
          errorMessage={inputError || ""}
        />
      </div>
      <div className="mb-5">
        <Button
          onPress={submitEmail}
          fullWidth
          isLoading={loading.email}
          isDisabled={areButtonsDisabled}
        >
          {mode === "login" ? "Login" : "Sign up"} with Email
        </Button>
      </div>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onPress={signInWithProvider("google")}
            fullWidth
            variant="flat"
            startContent={<Google />}
            isLoading={loading.google}
            isDisabled={areButtonsDisabled}
          >
            Google
          </Button>
          <Button
            onPress={signInWithProvider("github")}
            fullWidth
            variant="flat"
            startContent={<Github />}
            isLoading={loading.github}
            isDisabled={areButtonsDisabled}
          >
            Github
          </Button>
        </div>
      </div>
    </>
  );
}
