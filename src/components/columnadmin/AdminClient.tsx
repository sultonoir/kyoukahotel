/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React from "react";
import { api } from "@/utils/api";
import { type Reservation } from "@prisma/client";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminData from "./AdminData";
import RoomsAdmin from "../rooms/RoomsAdmin";

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
      <RoomsAdmin />
      <AdminData />
    </>
  );
};

export default AdminClient;
