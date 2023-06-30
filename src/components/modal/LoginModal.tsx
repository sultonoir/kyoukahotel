/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import useLoginModal from "@/hooks/useLoginModal";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import useRegisterModal from "@/hooks/useRegisterModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSumbit = () => {
    setIsLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          toast.success("Login successful");
          router.refresh();
        }
        if (callback?.error) {
          toast.error(callback?.error);
        }
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const footerContent = (
    <div className="flex flex-col gap-3 p-6 pt-0">
      <div className="text-center font-light text-neutral-500">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>First time using KyOuka ?</div>
          <div
            onClick={toggle}
            className="cursor-pointer text-neutral-800 hover:underline"
          >
            Create an account
          </div>
        </div>
      </div>
    </div>
  );

  const body = (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login with your account to access this website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSumbit();
            }
          }}
        >
          <div className="flex w-full flex-col gap-3">
            {isLoading ? (
              <Input
                disabled
                value={email}
                placeholder="email"
                type="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <Input
                value={email}
                placeholder="email"
                type="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {isLoading ? (
              <Input
                disabled
                value={password}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <Input
                value={password}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            className="w-full bg-rose-600 text-white hover:bg-rose-500"
            onClick={onSumbit}
          >
            Sumbit
          </Button>
        )}
      </CardFooter>
      <CardDescription>{footerContent}</CardDescription>
    </Card>
  );

  return (
    <Modal
      body={body}
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
    />
  );
};

export default LoginModal;
