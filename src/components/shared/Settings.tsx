import { type User } from "@prisma/client";
import { api } from "@/utils/api";
import React, { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvatarCom from "@/components/shared/AvatarCom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";

interface SettingsProps {
  data: User;
}

const Settings: React.FC<SettingsProps> = ({ data }) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [second, setSecond] = useState("");

  const { mutate: user } = api.user.updateUser.useMutation({
    onSuccess: (e) => {
      toast.success("User updated");
      setImage(e.image ?? "");
    },
  });

  const safeAccount = () => {
    user({
      id: data.id,
      name,
      image,
      email,
    });
  };

  const handleUploadComplete = (
    res:
      | {
          fileUrl: string;
          fileKey: string;
        }[]
      | undefined
  ) => {
    if (res) {
      const fileUrl = res[0]?.fileUrl ?? "";
      setImage(fileUrl);
    }
  };

  const handleRemove = useCallback(() => {
    setImage("");
  }, [setImage]);

  const handleUploadError = (error: Error) => {
    // Do something with the error.
    alert(`ERROR! ${error.message}`);
  };

  const { mutate } = api.user.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated");
      setPassword("");
      setSecond("");
    },
  });

  const savePassword = () => {
    mutate({
      id: data.id,
      password,
    });
  };

  return (
    <Tabs
      defaultValue="account"
      className={`${
        data.role === "admin" ? "pt-5" : ""
      } w-full pt-20 sm:mx-auto sm:w-[400px]`}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when youre done.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex w-full items-center">
              <div className="relative h-[150px] w-[150px]">
                <div className="absolute bottom-0 right-0 z-10">
                  <button
                    aria-hidden="true"
                    onClick={handleRemove}
                    className="
                  absolute
                  right-2
                  top-[-8.2rem]
                  rounded-full
                  bg-secondary
                  p-1
                  shadow
                  hover:bg-neutral-200
                  focus:outline-none
                "
                  >
                    <X size={20} />
                  </button>
                </div>
                <AvatarCom src={data.image || image} width={150} height={150} />
              </div>
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder={data.name ?? ""}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="Email">Email</Label>
              <Input
                id="Email"
                placeholder={data.email ?? ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={safeAccount}
            >
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you`&apos;`ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                type="password"
                value={second}
                onChange={(e) => setSecond(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input
                id="new"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={savePassword}
            >
              Save password
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Settings;
