"use client";

import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession, authClient } from "@/lib/auth-client";

const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 2084 2084"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 1261.500 386.593 C 1175.058 390.883, 1112.196 402.246, 1053.782 424.139 C 899.088 482.116, 815.015 606.859, 795.073 808 C 791.417 844.872, 790.871 861.373, 790.302 952.250 L 789.740 1042 682.870 1042 L 576 1042 576 1201.500 L 576 1361 683 1361 L 790 1361 790 1707.500 C 790 1898.075, 790.112 2054, 790.250 2054.001 C 790.388 2054.001, 799.500 2056.045, 810.500 2058.542 C 859.739 2069.721, 907.394 2076.914, 964 2081.712 C 990.176 2083.931, 1088.004 2084.249, 1114 2082.199 C 1130.277 2080.916, 1154.994 2078.530, 1164.250 2077.349 L 1169 2076.742 1169 1718.871 L 1169 1361 1309.531 1361 C 1421.049 1361, 1450.156 1360.742, 1450.514 1359.750 C 1450.762 1359.063, 1463.797 1288.525, 1479.481 1203 C 1495.164 1117.475, 1508.258 1046.263, 1508.578 1044.750 L 1509.159 1042 1339.079 1042 L 1169 1042 1169 973.700 C 1169 936.135, 1169.463 899.347, 1170.029 891.950 C 1174.004 839.999, 1184.893 802.512, 1204.720 772.528 C 1213.264 759.607, 1230.086 742.710, 1242.953 734.124 C 1272.283 714.553, 1307.005 703.937, 1358.500 698.797 C 1383.262 696.326, 1500.735 697.640, 1521.750 700.624 L 1526 701.227 1526 556.652 L 1526 412.077 1521.750 410.927 C 1491.730 402.806, 1424.954 393.582, 1359 388.445 C 1340.770 387.026, 1277.141 385.817, 1261.500 386.593"
      stroke="none"
      fill="#fbfbfc"
      fill-rule="evenodd"
    />
    <path
      d="M 1008 0.592 C 985.460 1.644, 959.680 3.295, 946 4.565 C 670.227 30.155, 418.432 162.987, 240.389 376.801 C 106.009 538.180, 23.811 736.598, 4.588 946 C 1.417 980.543, 0.581 1000.732, 0.591 1042.500 C 0.608 1117.947, 6.293 1176.448, 20.514 1247.500 C 56.622 1427.916, 137.658 1591.283, 260.595 1731.500 C 279.954 1753.581, 318.719 1792.897, 341.515 1813.571 C 465.158 1925.711, 613.410 2006.787, 772 2048.997 C 780.525 2051.266, 788.063 2053.306, 788.750 2053.530 C 789.748 2053.855, 790 1984.194, 790 1707.469 L 790 1361 683 1361 L 576 1361 576 1201.500 L 576 1042 682.870 1042 L 789.740 1042 790.302 952.250 C 790.871 861.373, 791.417 844.872, 795.073 808 C 820.645 550.073, 952.630 415.831, 1205.500 390.554 C 1247.586 386.348, 1315.518 385.062, 1351 387.802 C 1423.406 393.391, 1490.537 402.483, 1521.750 410.927 L 1526 412.077 1526 556.652 L 1526 701.227 1521.750 700.624 C 1500.735 697.640, 1383.262 696.326, 1358.500 698.797 C 1293.505 705.284, 1253.068 720.935, 1222.426 751.466 C 1191.297 782.481, 1175.077 825.970, 1170.029 891.950 C 1169.463 899.347, 1169 936.135, 1169 973.700 L 1169 1042 1339.079 1042 L 1509.159 1042 1508.578 1044.750 C 1508.258 1046.263, 1495.164 1117.475, 1479.481 1203 C 1463.797 1288.525, 1450.762 1359.063, 1450.514 1359.750 C 1450.156 1360.742, 1421.049 1361, 1309.531 1361 L 1169 1361 1169 1719.045 L 1169 2077.091 1172.250 2076.562 C 1174.037 2076.271, 1180.675 2075.323, 1187 2074.455 C 1446.438 2038.864, 1686.329 1903.226, 1851.920 1698.500 C 1918.227 1616.523, 1969.717 1529.360, 2008.760 1433 C 2047.069 1338.449, 2071.362 1237.319, 2080.463 1134.500 C 2082.758 1108.573, 2084.984 1062.735, 2084.993 1041.240 C 2085.004 1012.638, 2082.126 963.594, 2078.437 929.500 C 2056.387 725.732, 1975.096 533.941, 1844.046 376.500 C 1815.929 342.720, 1778.978 303.913, 1747 274.579 C 1607.354 146.481, 1437.427 59.389, 1253.500 21.650 C 1204.408 11.577, 1158.254 5.444, 1105.500 1.985 C 1089.243 0.919, 1021.688 -0.046, 1008 0.592 M 0.439 1042 C 0.439 1057.125, 0.578 1063.313, 0.748 1055.750 C 0.917 1048.188, 0.917 1035.813, 0.748 1028.250 C 0.578 1020.688, 0.439 1026.875, 0.439 1042"
      stroke="none"
      fill="#0c64fc"
      fill-rule="evenodd"
    />
  </svg>
);

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
    facebook: false,
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

  const areButtonsDisabled =
    loading.form || loading.github || loading.google || loading.facebook;

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
    (provider: "github" | "google" | "facebook") => async () => {
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
        <Button
          onPress={signInWithProvider("google")}
          fullWidth
          variant="flat"
          startContent={<GoogleIcon />}
          isLoading={loading.google}
          isDisabled={areButtonsDisabled}
        >
          Google
        </Button>
        <div className="flex gap-2">
          <Button
            onPress={signInWithProvider("github")}
            fullWidth
            variant="flat"
            startContent={
              <FontAwesomeIcon className="w-5 h-5" icon={faGithub} />
            }
            isLoading={loading.github}
            isDisabled={areButtonsDisabled}
          >
            Github
          </Button>
          <Button
            onPress={signInWithProvider("facebook")}
            fullWidth
            variant="flat"
            startContent={<FacebookIcon />}
            isLoading={loading.facebook}
            isDisabled={areButtonsDisabled}
          >
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
