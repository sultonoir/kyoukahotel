import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarMenu {
  src?: string | null | undefined;
}
const AvatarMenu: React.FC<AvatarMenu> = ({ src }) => {
  return (
    <Avatar>
      <AvatarImage src={src || `/placeholder.jpg`} className="object-cover" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default AvatarMenu;
