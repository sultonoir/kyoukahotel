/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { api } from "@/utils/api";
import { type Reservation } from "@prisma/client";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminClient = () => {
  const { data } = api.listings.getReservations.useQuery();

  if (!data) {
    return null;
  }

  const datas = data?.map((data: Reservation) => ({
    id: data.id,
    amount: data.totalPrice,
    status: data.status,
    name: data.guestName,
    checkin: data.startDate,
    checkout: data.endDate,
    rooms: data.rooms,
    title: data.title,
    email: data.guestEmail,
    userId: data.userId,
    created: data.createdAt,
    reservationId: data.guestId ?? "",
  }));
  return (
    <>
      <AdminDashboard reservation={datas} />
      <DataTable columns={columns} data={datas} />
    </>
  );
};

export default AdminClient;
