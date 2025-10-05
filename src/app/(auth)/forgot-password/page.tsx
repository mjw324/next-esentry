'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@heroui/react';
import { Mail } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // Adjust path to your auth client

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || 'Failed to send reset email');
        return;
      }

      setSuccess(true);
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
            <h1 className="text-2xl font-bold">Check your email</h1>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="bg-success-50 dark:bg-success-100/10 border border-success-200 dark:border-success-100/20 rounded-lg p-4">
              <p className="text-sm text-success-600 dark:text-success">
                We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>. 
                Please check your email and follow the instructions.
              </p>
            </div>
            <div className="text-center pt-2">
              <Link href="/login">
                <Button color="primary" variant="light" size="sm">
                  Return to login
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 text-center pb-2">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-small text-default-500">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              autoFocus
              endContent={
                <Mail className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              label="Email"
              placeholder="john.doe@example.com"
              variant="bordered"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              isInvalid={!!error}
              errorMessage={error}
              classNames={{
                label: "text-black/50 dark:text-white/90",
              }}
            />

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Send reset email
            </Button>

            <div className="text-center text-small">
              <span className="text-default-500">Remember your password? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}