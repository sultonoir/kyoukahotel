import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AuthShowcase = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSumbit = () => {
    setIsLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: true,
    })
      .then((callback) => {
        if (callback?.ok) {
          toast.success("Login successful");
          router.push("/admin");
        }
        if (callback?.error) {
          toast.error(callback?.error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="bglogin h-screen w-screen">
      <Card className="fixed left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2 transform">
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
            <Button className="w-full" onClick={onSumbit}>
              Sumbit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthShowcase;
