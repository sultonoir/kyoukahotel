import React from "react";
import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";
import Container from "../shared/Container";
import { api } from "@/utils/api";

const AdminNavbar = () => {
  const { data, isLoading } = api.user.getUserNotifi.useQuery();
  if (isLoading) {
    return null;
  }
  if (!data) {
    return null;
  }
  return (
    <div className="w-full bg-white">
      <div className="border-b p-2">
        <Container>
          <div className="flex items-center justify-between">
            <AdminMenu />
            <AdminProfile user={data} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminNavbar;
