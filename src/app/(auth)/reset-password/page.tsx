'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Input, Button, Divider, Chip, Progress, Spinner } from '@heroui/react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // Adjust path to your auth client

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const errorParam = searchParams.get('error');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (errorParam === 'INVALID_TOKEN') {
      setError('Invalid or expired reset token. Please request a new password reset.');
    }
  }, [errorParam]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "danger";
    if (passwordStrength <= 50) return "warning";
    if (passwordStrength <= 75) return "primary";
    return "success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('No reset token found. Please use the link from your email.');
      return;
    }

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error.message || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-1 text-center pb-6">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="text-success" size={48} />
            </div>
            <h1 className="text-2xl font-bold">Password reset successful!</h1>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="bg-success-50 dark:bg-success-100/10 border border-success-200 dark:border-success-100/20 rounded-lg p-4">
              <p className="text-sm text-success-600 dark:text-success text-center">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
            <Progress
              size="sm"
              isIndeterminate
              aria-label="Redirecting..."
              className="max-w-md"
              color="success"
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 text-center pb-2">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-small text-default-500">
            Enter your new password below
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          {!token || errorParam ? (
            <div className="flex flex-col gap-4">
              <div className="bg-danger-50 dark:bg-danger-100/10 border border-danger-200 dark:border-danger-100/20 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="text-danger mt-0.5" size={18} />
                  <p className="text-sm text-danger-600 dark:text-danger">
                    {error || 'Invalid reset link. Please request a new password reset.'}
                  </p>
                </div>
              </div>
              <Link href="/forgot-password">
                <Button color="primary" variant="flat" className="w-full">
                  Request new reset link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Input
                  label="New Password"
                  variant="bordered"
                  placeholder="Enter your new password"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-default-400 pointer-events-none" size={18} />
                      ) : (
                        <Eye className="text-default-400 pointer-events-none" size={18} />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-black/50 dark:text-white/90",
                  }}
                />
                {password && (
                  <div className="space-y-2">
                    <Progress 
                      size="sm"
                      value={passwordStrength}
                      color={getPasswordStrengthColor()}
                      className="max-w-md"
                      label={`Strength: ${getPasswordStrengthLabel()}`}
                      showValueLabel={false}
                    />
                    <div className="flex flex-wrap gap-1">
                      <Chip
                        size="sm"
                        color={password.length >= 8 ? "success" : "default"}
                        variant={password.length >= 8 ? "flat" : "bordered"}
                      >
                        8+ characters
                      </Chip>
                      <Chip
                        size="sm"
                        color={/[a-z]/.test(password) ? "success" : "default"}
                        variant={/[a-z]/.test(password) ? "flat" : "bordered"}
                      >
                        Lowercase
                      </Chip>
                      <Chip
                        size="sm"
                        color={/[A-Z]/.test(password) ? "success" : "default"}
                        variant={/[A-Z]/.test(password) ? "flat" : "bordered"}
                      >
                        Uppercase
                      </Chip>
                      <Chip
                        size="sm"
                        color={/\d/.test(password) ? "success" : "default"}
                        variant={/\d/.test(password) ? "flat" : "bordered"}
                      >
                        Number
                      </Chip>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                variant="bordered"
                placeholder="Confirm your new password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmVisibility}
                  >
                    {isConfirmVisible ? (
                      <EyeOff className="text-default-400 pointer-events-none" size={18} />
                    ) : (
                      <Eye className="text-default-400 pointer-events-none" size={18} />
                    )}
                  </button>
                }
                type={isConfirmVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isRequired
                isInvalid={!!confirmPassword && password !== confirmPassword}
                errorMessage={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
                classNames={{
                  label: "text-black/50 dark:text-white/90",
                }}
              />

              {error && (
                <div className="bg-danger-50 dark:bg-danger-100/10 border border-danger-200 dark:border-danger-100/20 rounded-lg p-3">
                  <p className="text-sm text-danger-600 dark:text-danger">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                className="w-full"
                startContent={!isLoading && <Lock size={18} />}
              >
                Reset password
              </Button>

              <div className="text-center text-small">
                <Link href="/login" className="text-primary hover:underline">
                  Return to login
                </Link>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Spinner size="lg" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}