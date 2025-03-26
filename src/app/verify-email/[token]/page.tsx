"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Spinner, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    const verifyEmailToken = async () => {
      try {
        const statusResponse = await fetch('/api/emails/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || 'Invalid or expired verification link');
        }

        setIsSuccess(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token]);

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center pb-2">
            <h1 className="text-2xl font-bold">Verifying Your Email</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4 py-8">
            <Spinner size="lg" color="primary" />
            <p className="text-center text-gray-600">
              Please wait while we verify your email...
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center pb-2">
            <h1 className="text-2xl font-bold">Email Verified!</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4 py-6">
            <CheckCircle size={64} className="text-success" />
            <p className="text-center text-gray-600">
              Your email has been successfully verified and is ready to receive alerts.
            </p>
            <Button color="primary" className="mt-4" onPress={goToDashboard}>
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center pb-2">
          <h1 className="text-2xl font-bold">Verification Failed</h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4 py-6">
          <AlertCircle size={64} className="text-danger" />
          <p className="text-center text-gray-600">
            {errorMessage || "We couldn't verify your email. The link may be invalid or expired."}
          </p>
          <Button color="primary" className="mt-4" onPress={goToDashboard}>
            Go to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
