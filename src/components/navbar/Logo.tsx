import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const Logo = () => {
  return (
    <Avatar>
      <Link href={"/"}>
        <AvatarImage src="/logo.svg" />
        <AvatarFallback>CN</AvatarFallback>
      </Link>
    </Avatar>
  );
};

export default Logo;
