import React from "react";
import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";
import Container from "../shared/Container";

const AdminNavbar = () => {
  return (
    <div className="w-full bg-white">
      <div className="border-b p-2">
        <Container>
          <div className="flex items-center justify-between">
            <AdminMenu />
            <AdminProfile />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminNavbar;
