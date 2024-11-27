"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { FaXmark } from "react-icons/fa6";

const OtpModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) {
        router.push("/");
      }
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <FaXmark
              onClick={() => setIsOpen(false)}
              className="absolute top-0 right-0 cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We've sent an OTP code to{" "}
            <span className="pl-1 text-blue-800">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="flex justify-between gap-4 w-full">
            <InputOTPSlot
              index={0}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
            <InputOTPSlot
              index={1}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
            <InputOTPSlot
              index={2}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
            <InputOTPSlot
              index={3}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
            <InputOTPSlot
              index={4}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
            <InputOTPSlot
              index={5}
              className="w-1/6 border border-blue-950 border-opacity-30 rounded-md"
            />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="rounded-xl bg-blue-800 h-12"
              type="button"
            >
              Confirm
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt="lodaer"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn't receive the code?{" "}
              <Button
                type="button"
                className="pl-1 text-blue-700"
                onClick={handleResendOtp}
                variant={"link"}
              >
                Resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
