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
  Dot,
  Settings2Icon,
  Bell,
  Loader2,
  UserPlus2,
} from "lucide-react";

import React from "react";

import { signOut } from "next-auth/react";

import { api } from "@/utils/api";
import AvatarMenu from "../navbar/AvatarMenu";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { type Notifi, type User } from "@prisma/client";
import useRegisterAdmin from "@/hooks/useRegisterAdmin";

interface Props {
  user: User & {
    notifi: Notifi[];
  };
}

const AdminProfile: React.FC<Props> = ({ user }) => {
  const register = useRegisterAdmin();
  const router = useRouter();

  const { mutate } = api.user.getNotifications.useMutation();

  const getNotifications = () => {
    mutate({
      id: user.email,
    });
  };

  const { mutate: delet, isLoading } = api.user.deleteNotifications.useMutation(
    {
      onSuccess: () => {
        toast.success("Notifications Deleted");
      },
    }
  );

  const deletNotif = () => {
    delet({
      userid: user.id ?? "",
    });
  };

  return (
    <Sheet>
      <DropdownMenu>
        {user.role === "admin" && (
          <>
            <DropdownMenuTrigger asChild>
              <div className="relative flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-3 transition hover:shadow-md md:px-2 md:py-1">
                <Menu size={20} />
                <div className="hidden md:flex">
                  <AvatarMenu src={user.image} />
                </div>
                {user.hasNotifi && (
                  <div className="absolute -right-[1.25rem] -top-[24px] animate-pulse text-rose-500">
                    <Dot size={70} />
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="capitalize">
                {user.name}
              </DropdownMenuLabel>
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
                className="flex cursor-pointer gap-2"
                onClick={() => router.push("/setting")}
              >
                <Settings2Icon size={20} />
                Setting
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer gap-2"
                onClick={register.onOpen}
              >
                <UserPlus2 size={20} />
                Register
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
        {user.notifi.map((notif) => {
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

export default AdminProfile;
