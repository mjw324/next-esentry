"use client";

import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession, authClient } from "@/lib/auth-client";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export function UserAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { data } = useSession();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState({
    form: false,
    github: false,
    google: false,
  });

  useEffect(() => {
    const errorType = searchParams.get("error");

    if (errorType) {
      let errorMessage = "Authentication failed. Please try again.";

      if (errorType === "OAuthAccountNotLinked") {
        errorMessage =
          "An account with this email already exists. Please try logging in through a different method.";
      }

      // Display the error message as a toast
      addToast({
        title: "Authentication Error",
        description: errorMessage,
        color: "danger",
      });

      // Clean up the URL to prevent the error from showing again on refresh
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const areButtonsDisabled = loading.form || loading.github || loading.google;

  const callbackUrl = "/dashboard";

  // Handle name change with validation
  const handleNameChange = (value: string) => {
    setName(value);

    // Clear error when field is empty
    if (!value) {
      setErrors((prev) => ({ ...prev, name: undefined }));
      return;
    }
  };

  // Validate email in real-time
  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  // Validate password in real-time
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Clear error when field is empty
    if (!value) {
      setErrors((prev) => ({ ...prev, password: undefined }));
      return;
    }

    // Validate password
    const result = passwordSchema.safeParse(value);
    if (result.success) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: result.error.issues[0].message,
      }));
    }

    // Check if confirm password matches (for register mode)
    if (mode === "register" && confirmPassword) {
      if (value === confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      }
    }
  };

  // Validate confirm password in real-time
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    // Clear error when field is empty
    if (!value) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      return;
    }

    // Check if passwords match
    if (password === value) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  };

  // Final validation before form submission
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate name for registration
    if (mode === "register") {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.issues[0].message;
      }
    }

    // Validate confirm password for registration
    if (mode === "register") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading((prev) => ({ ...prev, form: true }));

    try {
      if (mode === "register") {
        // Registration endpoint
        const { data, error } = await authClient.signUp.email({
          name: name.trim(),
          email: email,
          password: password,
        });

        if (error) {
          throw new Error(error.message || "Failed to register");
        }

        addToast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
          color: "success",
        });

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      }
      if (mode === "login") {
        // Try to authenticate with credentials
        try {
          const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
          });

          if (error) {
            // Handle standard Auth.js errors
            addToast({
              title: "Authentication Failed",
              description: "Invalid email or password",
              color: "danger",
            });
          } else if (data) {
            addToast({
              title: "Login Successful",
              description: "Redirecting to dashboard...",
              color: "success",
              timeout: 1000,
            });
            router.push(callbackUrl);
          } else {
            // Fallback error
            addToast({
              title: "Login Failed",
              description: "Please check your credentials and try again.",
              color: "danger",
            });
          }
        } catch (signInError) {
          // Handle any unexpected errors from signIn
          console.error("Sign in error:", signInError);
          addToast({
            title: "Authentication Error",
            description:
              "There was a problem processing your request. Please try again.",
            color: "danger",
          });
        }
      }
    } catch (error) {
      // Other errors from the try block
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        color: "danger",
      });
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const signInWithProvider = useCallback(
    (provider: "github" | "google") => async () => {
      setLoading((prev) => ({
        ...prev,
        [provider]: true,
      }));
      try {
        const signInResult = await signIn.social({
          provider,
          callbackURL: callbackUrl, // Note: better-auth uses callbackURL (capital URL)
        });

        // Better-auth returns data differently - check for errors
        if (!signInResult || signInResult.error) {
          throw new Error(signInResult?.error?.message || "Sign in failed");
        }

        // If successful, better-auth will handle the redirect automatically
        // You might want to add additional success handling here
      } catch (error) {
        addToast({
          title: "Authentication Failed",
          description:
            error instanceof Error ? error.message : "Please try again.",
          color: "danger",
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          [provider]: false,
        }));
      }
    },
    [callbackUrl]
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <Input
              value={name}
              onValueChange={handleNameChange}
              label="Name"
              type="text"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
          </div>
        )}

        <div>
          <Input
            value={email}
            onValueChange={handleEmailChange}
            label="Email"
            type="email"
          />
        </div>

        <div>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onValueChange={handlePasswordChange}
            label="Password"
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            }
          />
        </div>

        {mode === "register" && (
          <div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onValueChange={handleConfirmPasswordChange}
              label="Confirm Password"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              }
            />
          </div>
        )}

        {mode === "login" && (
          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-primary">
              Forgot password?
            </a>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={loading.form}
          isDisabled={areButtonsDisabled}
        >
          {mode === "login" ? "Login" : "Sign up"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-3">
        <div className="flex gap-2">
          <Button
            onPress={signInWithProvider("google")}
            fullWidth
            variant="flat"
            startContent={
              <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
            }
            isLoading={loading.google}
            isDisabled={areButtonsDisabled}
          >
            Google
          </Button>
          <Button
            onPress={signInWithProvider("github")}
            fullWidth
            variant="flat"
            startContent={
              <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            }
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
