import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppWindow, ImageIcon, Menu, Monitor, Star } from "lucide-react";
import Link from "next/link";

export default function AdminMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="my-4">
        <Button title="menu admin" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent position="left" className="w-[320px]">
        <SheetHeader>
          <SheetTitle>Admin menu</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you re done.
          </SheetDescription>
        </SheetHeader>
        <ul className="mt-2">
          <li>
            <Link className="flex gap-3 p-3 hover:bg-secondary" href="/admin">
              <Monitor size={24} />
              Dasboard
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-3 p-3 hover:bg-secondary"
              href="/admin/banner"
            >
              <ImageIcon size={24} />
              Banner Promosi
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-3 p-3 hover:bg-secondary"
              href="/admin/rattings"
            >
              <Star size={24} />
              Rattings
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-3 p-3 hover:bg-secondary"
              href="/admin/rooms"
            >
              <AppWindow size={24} />
              Property
            </Link>
          </li>
        </ul>
        <SheetFooter className="fixed bottom-1 w-[280px]">
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
