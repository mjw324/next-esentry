'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Mail } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // Adjust path to your auth client

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      addToast({
        title: "Check your email",
        description: `We've sent a password reset link to ${email}. Please check your email and follow the instructions.`,
        color: "success",
      });
      router.push('/login');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
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