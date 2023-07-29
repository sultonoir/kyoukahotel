/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

const AdminData = () => {
  const { data } = api.listings.getReservations.useQuery();
  const ctx = api.useContext();

  if (!data) {
    return null;
  }
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "guestName",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "guestEmail",
      headerName: "Email",
      width: 150,
      editable: true,
    },
    {
      field: "rooms",
      headerName: "Rooms",
      width: 90,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: true,
      renderCell: (param) => {
        const { data } = api.listings.getReservationsId.useQuery({
          id: param.row.id,
        });
        if (data?.status === "success") {
          return (
            <p className="rounded-lg bg-green-600 px-2 py-1 text-center text-secondary">
              Success
            </p>
          );
        } else if (data?.status === "completed") {
          return (
            <p className="rounded-lg bg-blue-600 px-2 py-1 text-center text-secondary">
              Completed
            </p>
          );
        } else if (data?.status === "rattings") {
          return (
            <p className="rounded-lg bg-yellow-600 px-2 py-1 text-center text-secondary">
              Added ratings
            </p>
          );
        } else if (data?.status === "capture") {
          return (
            <p className="rounded-lg bg-green-600 px-2 py-1 text-center text-secondary">
              Success
            </p>
          );
        } else if (data?.status === "pending") {
          return (
            <p className="rounded-lg bg-secondary px-2 py-1 text-center text-primary">
              Pending
            </p>
          );
        } else if (data?.status === "settlement") {
          return (
            <p className="rounded-lg bg-green-600 px-2 py-1 text-center text-secondary">
              Success
            </p>
          );
        } else if (data?.status === "deny") {
          return (
            <p className="rounded-lg bg-rose-600 px-2 py-1 text-center text-secondary">
              Failed
            </p>
          );
        } else if (data?.status === "expire") {
          return (
            <p className="rounded-lg bg-rose-600 px-2 py-1 text-center text-secondary">
              Failed
            </p>
          );
        }
      },
    },
    {
      field: "startDate",
      headerName: "Chek-in",
      width: 150,
      editable: true,
      renderCell: (param) => {
        const chekin = format(param.row.startDate, "PPP");
        return chekin;
      },
    },
    {
      field: "endDate",
      headerName: "Chek-out",
      width: 150,
      editable: true,
      renderCell: (param) => {
        const chekin = format(param.row.endDate, "PPP");
        return chekin;
      },
    },
    {
      field: "totalPrice",
      headerName: "Amount",
      width: 150,
      editable: true,
      renderCell: (param) => {
        const formatter = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        });

        const amount = formatter.format(param.row.totalPrice);
        return amount;
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 90,
      editable: true,
      renderCell: (param) => {
        const { mutate } = api.listings.deleteReservasi.useMutation({
          onSuccess: () => {
            toast.success("stay over");
            void ctx.admin.invalidate();
            void ctx.listings.invalidate();
          },
        });
        const onComplete = () => {
          mutate({
            id: param.row.id,
          });
        };
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onComplete}>Complete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="mb-5">
      <DataGrid
        rows={data}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default AdminData;
