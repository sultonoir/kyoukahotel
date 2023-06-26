import { type Listing, type Reservation, type User } from "@prisma/client";
import { Playfair_Display } from "next/font/google";

export const play = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-play",
  display: "swap",
});

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeNotifications = Omit<Notification, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeUserNotif = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  notifi: Notification[];
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export const adminNav = [
  {
    title: "Dashboard",
    href: "/admin",
  },
];

export const NavItem = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Rooms",
    href: "/rooms",
  },
  {
    title: "Facilities",
    href: "/facilities",
  },
];
