import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Avatar>
        <AvatarImage src="/logo.svg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default Logo;
