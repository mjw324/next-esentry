"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Tooltip,
  Button,
  Input,
  InputOtp,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import {
  Trash2, 
  BellRing, 
  RectangleEllipsis,
  Mail,
  MailPlus,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

// column structure
const columns = [
  { name: "EMAIL", uid: "email" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type EmailStatus = "active" | "pending verification" | "ready";

// Status color mapping using HeroUI's color types
const statusColorMap: Record<EmailStatus, ChipProps["color"]> = {
  "active": "success",
  "pending verification": "warning",
  "ready": "primary",
};

interface EmailItem {
  id: string;
  email: string;
  status: EmailStatus;
  createdAt: string;
  updatedAt: string;
}

export default function AlertPreferences() {
  const router = useRouter();
  const { data: session } = useSession();
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [currentVerifyingId, setCurrentVerifyingId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Modal disclosures
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isVerifyOpen, 
    onOpen: onVerifyOpen, 
    onClose: onVerifyClose 
  } = useDisclosure();

  // Fetch emails from API
  const fetchEmails = useCallback(async () => {
    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      addToast({
        title: "Error",
        description: "Failed to load alert emails",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch emails from API on component mount
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddEmail = async () => {
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Check if email already exists
    if (emails.some(item => item.email === newEmail)) {
      setEmailError("This email is already in your list");
      return;
    }

    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }

    // Set loading state
    setIsAddingEmail(true);

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add email');
      }

      const data = await response.json();

      // Close add email modal and reset form
      setNewEmail("");
      setEmailError("");
      onClose();

      // Refresh the emails list
      await fetchEmails();

      // If email was added successfully, open verification modal
      if (data.email && data.email.id) {
        setCurrentVerifyingId(data.email.id);
        setOtpValue("");
        setOtpError("");
        onVerifyOpen();

        addToast({
          title: "Success",
          description: `Verification code sent to ${newEmail}`,
          color: "success",
        });
      }
    } catch (error) {
      console.error("Error adding email:", error);
      setEmailError(error instanceof Error ? error.message : "Failed to add email");
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleDeleteEmail = useCallback(async (id: string) => {
    if (isProcessingAction) return;
  
    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }

    setIsProcessingAction(true);
    try {
      const response = await fetch(`/api/emails/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
      });
  
      if (!response.ok) {
        if (response.status !== 204) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete email');
        }
      }
  
      // Refresh emails list
      await fetchEmails();
  
      addToast({
        title: "Success",
        description: "Email deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error deleting email:", error);
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete email",
        color: "danger",
      });
    } finally {
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, fetchEmails]);
  
  const handleSetActive = useCallback(async (id: string) => {
    if (isProcessingAction) return;

    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }
  
    setIsProcessingAction(true);
    try {
      const response = await fetch(`/api/emails/${id}/set-active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set email as active');
      }
  
      const data = await response.json();
  
      // Update emails with response data
      if (data.emails) {
        setEmails(data.emails);
      } else {
        // Fallback to refreshing all emails
        await fetchEmails();
      }
  
      addToast({
        title: "Success",
        description: "Alert email activated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error setting email as active:", error);
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set email as active",
        color: "danger",
      });
    } finally {
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, fetchEmails, setEmails]);
  
  const handleVerifyEmail = useCallback((id: string) => {
    // Store the ID of the email being verified
    setCurrentVerifyingId(id);
  
    // Reset OTP value and errors
    setOtpValue("");
    setOtpError("");
  
    // Open verification modal
    onVerifyOpen();
  }, [onVerifyOpen, setCurrentVerifyingId, setOtpValue, setOtpError]);

  const handleVerifyOtp = async () => {
    // Validate OTP
    if (otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }

    if (!currentVerifyingId) return;

    setIsVerifying(true);
    try {
      const response = await fetch(`/api/emails/${currentVerifyingId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
        body: JSON.stringify({ otp: otpValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid verification code');
      }

      const data = await response.json();

      // Close the modal and reset state
      onVerifyClose();
      setCurrentVerifyingId(null);
      setOtpValue("");

      // Refresh emails list
      await fetchEmails();

      addToast({
        title: "Success",
        description: "Email verified successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      setOtpError(error instanceof Error ? error.message : "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!currentVerifyingId) return;

    if (!session?.user?.id) {
      addToast({
        title: "Error",
        description: "You must be logged in to perform this action",
        color: "danger",
      });
      return;
    }

    setIsResendingCode(true);
    try {
      const response = await fetch(`/api/emails/${currentVerifyingId}/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resend verification code');
      }

      // Get the email address for the toast message
      const email = getCurrentVerifyingEmail();

      // Show success toast
      addToast({
        title: "Success",
        description: `Verification code resent to ${email}`,
        color: "success",
      });
    } catch (error) {
      console.error("Error resending code:", error);
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend code",
        color: "danger",
      });
    } finally {
      setIsResendingCode(false);
    }
  };

  const getCurrentVerifyingEmail = (): string => {
    const email = emails.find(e => e.id === currentVerifyingId);
    return email ? email.email : "";
  };

  const renderCell = React.useCallback((item: EmailItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof EmailItem];

    switch (columnKey) {
      case "email":
        return (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>{cellValue}</span>
          </div>
        );
      case "status":
        return (
          <Chip 
            className="capitalize" 
            color={statusColorMap[item.status as EmailStatus]}
            size="sm" 
            variant="flat"
          >
            {item.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-end">
            {item.status !== "active" && item.status === "ready" && (
              <Tooltip content="Set as active">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="success"
                  onPress={() => handleSetActive(item.id)}
                  isDisabled={isProcessingAction}
                >
                  <BellRing size={18} />
                </Button>
              </Tooltip>
            )}

            {item.status === "pending verification" && (
              <Tooltip content="Verify email">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="warning"
                  onPress={() => handleVerifyEmail(item.id)}
                >
                  <RectangleEllipsis size={18} />
                </Button>
              </Tooltip>
            )}

            {item.status !== "active" && (
              <Tooltip color="danger" content="Delete email">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="danger"
                  onPress={() => handleDeleteEmail(item.id)}
                  isDisabled={isProcessingAction}
                >
                  <Trash2 size={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, [isProcessingAction, handleDeleteEmail, handleSetActive, handleVerifyEmail]);

  return (
    <div className="container pt-8 px-8 mx-auto xl:px-0">
      <div className="mb-6">
        <Button 
          variant="light" 
          color="default" 
          startContent={<ArrowLeft size={18} />}
          onPress={() => router.push('/dashboard')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alert Email Preferences</h1>
          <Button 
            color="primary" 
            onPress={onOpen}
            startContent={<MailPlus size={18} />}
          >
            Add Email
          </Button>
        </div>
      </div>

      <div className="py-6">
        <p className="text-gray-600 mb-4">
          Configure which email receives alerts and notifications. Only one email can be active at a time.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table aria-label="Alert email preferences table">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn 
                  key={column.uid} 
                  align={column.uid === "actions" ? "end" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={emails} emptyContent={"No alert emails configured"}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Email Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add Alert Email</ModalHeader>
          <ModalBody>
            <Input
              type="email"
              label="Email"
              variant="bordered"
              size="lg"
              value={newEmail}
              onValueChange={setNewEmail}
              isInvalid={!!emailError}
              errorMessage={emailError}
            />
            <p className="text-sm text-gray-500 mt-2">
              We will send you a one-time PIN (OTP) to the email provided to verify it&apos;s you.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleAddEmail}
              isLoading={isAddingEmail}
            >
              Add Email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Verify Email OTP Modal */}
      <Modal isOpen={isVerifyOpen} onClose={onVerifyClose}>
        <ModalContent>
          <ModalHeader>Verify Email</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4">
              <ShieldCheck size={48} className="text-warning" />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Email Verification</h3>
                <p className="text-gray-600 mb-4">
                  We&apos;ve sent a verification code to:<br />
                  <span className="font-medium">{getCurrentVerifyingEmail()}</span>
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <InputOtp
                  length={6}
                  value={otpValue}
                  onValueChange={setOtpValue}
                  isInvalid={!!otpError}
                  errorMessage={otpError}
                  description="Enter the 6-digit code sent to your email"
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Didn&apos;t receive the code? 
                <Button 
                  variant="light" 
                  size="sm"
                  onPress={handleResendCode}
                  isLoading={isResendingCode}
                  isDisabled={isResendingCode}
                >
                  Resend Code
                </Button>
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onVerifyClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleVerifyOtp}
              isLoading={isVerifying}
            >
              Verify
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
