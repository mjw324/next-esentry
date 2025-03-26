"use client";

import { useState } from "react";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address");

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }

    setEmailError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setIsSuccess(true);
    } catch (error) {
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center pb-2">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {isSuccess ? (
            <div className="text-center py-6">
              <h2 className="text-xl font-semibold mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                If an account exists with {email}, we&apos;ve sent instructions to reset your password.
              </p>
              <Link href="/login">
                <Button color="primary">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600">
                Enter the email associated with your account and we&apos;ll send you instructions to reset your password.
              </p>
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
                errorMessage={emailError}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  Send Reset Instructions
                </Button>
                <div className="mt-4 text-center">
                  <Link href="/login" className="text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
