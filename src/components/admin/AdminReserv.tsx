import { api } from "@/utils/api";
import React from "react";
import AdminReservasi from "./AdminReservasi";

const AdminReserv = () => {
  const { data: listings } = api.admin.getAllRooms.useQuery();

  if (!listings) {
    return null;
  }
  return (
    <div>
      <AdminReservasi listing={listings} />
    </div>
  );
};

export default AdminReserv;
