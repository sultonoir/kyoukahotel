import React from "react";
import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";
import Container from "../shared/Container";
import { api } from "@/utils/api";
import EmptyState from "../shared/EmptyState";

const AdminNavbar = () => {
  const { data } = api.admin.getAdmin.useQuery();
  if (!data) {
    return <EmptyState />;
  }
  return (
    <div className="w-full bg-white">
      <div className="border-b p-2">
        <Container>
          <div className="flex items-center justify-between">
            {data.role === "Admin" && <AdminMenu />}
            <AdminProfile admin={data} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminNavbar;
