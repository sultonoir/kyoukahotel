/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Menu,
  LogOutIcon,
  Banknote,
  History,
  Dot,
  Settings2Icon,
  Search,
  MartiniIcon,
  BedDoubleIcon,
} from "lucide-react";

import React, { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Notifications from "../shared/Notifications";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import useSearchModal from "@/hooks/useSearchModal";

const UserMenu = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
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
      {data.role !== "admin" && (
        <div className="flex gap-5">
          <div
            className="flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-3 transition hover:shadow-md sm:hidden"
            onClick={searchModal.onOpen}
          >
            <Search size={24} />
          </div>
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
            <DropdownMenuItem
              className="flex cursor-pointer md:hidden"
              onClick={() => router.push("/facilities")}
            >
              <MartiniIcon className="mr-2" />
              Facilities
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer md:hidden"
              onClick={() => router.push("/rooms")}
            >
              <BedDoubleIcon className="mr-2" />
              Rooms
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/payment")}
            >
              <Banknote className="mr-2" />
              Paymet
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger asChild onClick={getNotifications}>
                <Notifications notifikasi={data.notifi} userId={data.id} />
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/history")}
            >
              <History className="mr-2" />
              History
            </DropdownMenuItem>
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
        </div>
      )}
    </DropdownMenu>
  );
};

export default UserMenu;
