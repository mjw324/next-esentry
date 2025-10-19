"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Spinner, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ShieldCheck, AlertCircle, CheckCircle, Unplug } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export default function UnsubscribePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const unsubscribeFromMonitor = async () => {
      try {
        const response = await fetch(`${API_URL}/api/unsubscribe/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid or expired unsubscribe link');
        }

        const data = await response.json();
        if (data.success) {
          setIsSuccess(true);
        } else {
          throw new Error(data.message || 'Failed to unsubscribe');
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unsubscribe failed');
      } finally {
        setIsProcessing(false);
      }
    };

    unsubscribeFromMonitor();
  }, [token]);

  const goToLogin = () => {
    router.push('/login');
  };

  const goToHome = () => {
    router.push('/');
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center pb-2">
            <h1 className="text-2xl font-bold">Processing Unsubscribe</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4 py-8">
            <Spinner size="lg" color="primary" />
            <p className="text-center text-gray-600">
              Please wait while we process your unsubscribe request...
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
            <h1 className="text-2xl font-bold">Successfully Unsubscribed</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4 py-6">
            <CheckCircle size={64} className="text-success" />
            <p className="text-center text-gray-600">
              You have been successfully unsubscribed from monitor notifications.
              The monitor has been deactivated and you will no longer receive alerts.
            </p>
            <div className="flex flex-col gap-2 mt-4 w-full">
              <Button color="primary" onPress={goToLogin}>
                Sign In to Dashboard
              </Button>
              <Button variant="light" onPress={goToHome}>
                Go to Home
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center pb-2">
          <h1 className="text-2xl font-bold">Unsubscribe Failed</h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4 py-6">
          <AlertCircle size={64} className="text-danger" />
          <p className="text-center text-gray-600">
            {errorMessage || "We couldn't process your unsubscribe request. The link may be invalid or expired."}
          </p>
          <div className="flex flex-col gap-2 mt-4 w-full">
            <Button color="primary" onPress={goToLogin}>
              Sign In to Dashboard
            </Button>
            <Button variant="light" onPress={goToHome}>
              Go to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}