/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, LogOutIcon, Dot, Settings2Icon } from "lucide-react";

import React, { useState } from "react";

import { signOut } from "next-auth/react";

import { api } from "@/utils/api";
import Notifications from "../shared/Notifications";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import AvatarMenu from "../navbar/AvatarMenu";
import { useRouter } from "next/navigation";

const AdminProfile = () => {
  const router = useRouter();
  const { data } = api.user.getUser.useQuery();
  const [notif, setNotif] = useState(data?.hasNotifi);
  if (!data) {
    return null;
  }

  const { mutate } = api.user.getNotifications.useMutation({
    onSuccess: (e) => {
      setNotif(e.hasNotifi);
    },
  });

  const getNotifications = () => {
    mutate({
      id: data.email,
    });
  };

  return (
    <DropdownMenu>
      {data.role === "admin" && (
        <>
          <DropdownMenuTrigger asChild>
            <div className="relative flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-3 transition hover:shadow-md md:px-2 md:py-1">
              <Menu size={20} />
              <div className="hidden md:flex">
                <AvatarMenu src={data.image} />
              </div>
              {notif && (
                <div className="absolute -right-[1.25rem] -top-[24px] animate-pulse text-rose-500">
                  <Dot size={70} />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger onClick={getNotifications}>
                <Notifications notifikasi={data.notifi} userId={data.id} />
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>

            <DropdownMenuItem
              className="flex cursor-pointer gap-2"
              onClick={() => router.push("/setting")}
            >
              <Settings2Icon size={20} />
              Setting
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer gap-2"
              onClick={() => signOut()}
            >
              <LogOutIcon size={20} />
              <p>Logout</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
};

export default AdminProfile;
