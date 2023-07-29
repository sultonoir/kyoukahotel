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
  Bell,
  Loader2,
} from "lucide-react";

import React from "react";
import AvatarMenu from "./AvatarMenu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import useSearchModal from "@/hooks/useSearchModal";
import { toast } from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";

const UserMenu = () => {
  const ctx = api.useContext();
  const router = useRouter();
  const searchModal = useSearchModal();
  const { data } = api.user.getUser.useQuery();
  if (!data) {
    return null;
  }

  const { mutate } = api.user.getNotifications.useMutation({
    onSuccess: () => {
      void ctx.user.invalidate();
      void ctx.admin.invalidate();
      void ctx.listings.invalidate();
      void ctx.payment.invalidate();
    },
  });

  const getNotifications = () => {
    mutate({
      id: data.email,
    });
  };

  const { mutate: delet, isLoading } = api.user.deleteNotifi.useMutation({
    onSuccess: () => {
      toast.success("Notifications Deleted");
      void ctx.user.invalidate();
      void ctx.admin.invalidate();
      void ctx.listings.invalidate();
      void ctx.payment.invalidate();
    },
  });

  const deletNotif = () => {
    delet({
      id: data.id,
    });
  };

  return (
    <Sheet>
      <DropdownMenu>
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
              {data.hasNotifi && (
                <div className="absolute -right-[1.25rem] -top-[24px] animate-pulse text-rose-500">
                  <Dot size={70} />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SheetTrigger onClick={getNotifications}>
                <div className="flex cursor-pointer gap-2">
                  <Bell size={20} />
                  Notifications
                </div>
              </SheetTrigger>
            </DropdownMenuItem>
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
      </DropdownMenu>
      <SheetContent position="right" className="w-[320px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>This notofications for you</SheetDescription>
        </SheetHeader>
        <Button
          className="my-4 w-full"
          disabled={isLoading}
          onClick={deletNotif}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <p>Delet all notofications</p>
          )}
        </Button>
        {data.notifi?.map((notif) => {
          return (
            <div key={notif.id} className="mt-2 flex gap-2 overflow-y-auto">
              <AvatarMenu src={notif.guestImage} />
              <div className="flex flex-col">
                <h3 className="font-semibold">{notif.guestName}</h3>
                <p className="">{notif.message}</p>
              </div>
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
