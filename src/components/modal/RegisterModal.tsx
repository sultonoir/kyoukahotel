import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [userError, setUserError] = React.useState("");
  const ctx = api.useContext();
  const { mutate, isLoading, error } = api.example.create.useMutation({
    onSuccess: () => {
      setName("");
      setPassword("");
      setEmail("");
      loginModal.onOpen();
      registerModal.onClose();
      void ctx.example.getAll.invalidate();
      toast.success("Account created");
    },
    onError: (e) => {
      const nameError = e.data?.zodError?.fieldErrors.name;
      const passwordError = e.data?.zodError?.fieldErrors.password;
      if (!nameError && !passwordError) {
        setUserError(e.message);
      }
    },
  });

  const nameError = error?.data?.zodError?.fieldErrors.name;
  const passwordError = error?.data?.zodError?.fieldErrors.password;

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const toggle = React.useCallback(() => {
    loginModal.onOpen();
    registerModal.onClose();
  }, [loginModal, registerModal]);

  const footerContent = (
    <div className="flex flex-col gap-3 p-6 pt-0">
      <div className="text-center font-light text-neutral-500">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>All ready have an account ?</div>
          <div
            onClick={toggle}
            className="cursor-pointer text-neutral-800 hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );

  const body = (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              mutate({ name: name, email: email, password: password });
            }
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              {isLoading ? (
                <Input
                  disabled
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <Input
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <p className="text-destructive">{nameError}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              {isLoading ? (
                <Input
                  disabled
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
              <p className="text-destructive">{userError}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              {isLoading ? (
                <Input
                  disabled
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              ) : (
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <p className="text-destructive">{passwordError}</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-rose-600 text-white hover:bg-rose-500"
          onClick={() =>
            mutate({ name: name, email: email, password: password })
          }
        >
          Submit
        </Button>
      </CardFooter>
      <CardDescription>{footerContent}</CardDescription>
    </Card>
  );

  return (
    <Modal
      body={body}
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
    />
  );
};

export default RegisterModal;
