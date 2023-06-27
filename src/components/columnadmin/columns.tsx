/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";

export type Payment = {
  amount: number;
  status: string | null;
  name: string | null;
  checkin: Date;
  checkout: Date;
  rooms: number;
  title: string | null;
  id: string;
  email: string | null | undefined;
  userId: string | null;
  created: Date;
  reservationId: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "checkin",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check in
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const checkin = new Date(row.getValue("checkin"));
      const formatted = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(checkin);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "checkout",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const checkin = new Date(row.getValue("checkout"));
      const formatted = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(checkin);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status === "success") {
        return (
          <p className="rounded-lg bg-green-600 px-2 py-1 text-center text-secondary">
            success
          </p>
        );
      } else if (status === "completed") {
        return (
          <p className="rounded-lg bg-blue-600 px-2 py-1 text-center text-secondary">
            Completed
          </p>
        );
      } else if (status === "rattings") {
        return (
          <p className="rounded-lg bg-yellow-600 px-2 py-1 text-center text-secondary">
            Added ratings
          </p>
        );
      } else {
        return (
          <p className="rounded-lg bg-secondary px-2 py-1 text-center text-primary">
            Pending
          </p>
        );
      }
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "rooms",
    header: "Rooms",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const payment = row.original;
      const { mutate } = api.listings.completeReservation.useMutation({
        onSuccess: () => {
          toast.success("stay over");
        },
      });
      const onComplete = () => {
        mutate({
          reservationsId: payment.id,
          rooms: payment.rooms,
        });
      };
      const { mutate: getinvoice } = api.listings.getInvoice.useMutation({
        onSuccess: (e) => {
          router.push(e ?? "");
        },
      });

      const onSucces = () => {
        getinvoice({
          email: payment.email ?? "",
          reservationsId: payment.id,
        });
      };
      const { data } = api.listings.getReservationsId.useQuery({
        id: payment.id,
      });
      console.log(data);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onComplete}>Complete</DropdownMenuItem>
            <DropdownMenuItem onClick={onSucces}>getinvoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
