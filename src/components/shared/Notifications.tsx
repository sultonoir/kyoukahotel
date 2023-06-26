import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, Loader2 } from "lucide-react";
import { type Notifi } from "@prisma/client";
import AvatarMenu from "../navbar/AvatarMenu";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";

interface NotificationsProps {
  notifikasi: Notifi[];
  userId: string;
}
const Notifications: React.FC<NotificationsProps> = ({
  notifikasi,
  userId,
}) => {
  const [notifi, setNotifi] = useState(notifikasi);
  const { mutate, isLoading } = api.user.deleteNotifications.useMutation({
    onSuccess: (e) => {
      toast.success("Notifications Deleted");
      setNotifi(e.notifi);
    },
  });

  const deletNotif = () => {
    mutate({
      userid: userId,
    });
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex border-none px-2 py-1.5 hover:bg-secondary">
          <Bell className="mr-2" />
          Notifications
        </div>
      </SheetTrigger>
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
        {notifi.map((notif) => {
          return (
            <div key={notif.id} className="mt-2 flex gap-2">
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

export default Notifications;
