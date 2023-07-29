import AdminNavbar from "@/components/admin/AdminNavbar";
import Container from "@/components/shared/Container";
import { api } from "@/utils/api";
import React from "react";
import AdminClient from "../../components/columnadmin/AdminClient";
import AuthShowcase from "@/components/form/AuthShowcase";
import Loader from "@/components/shared/Loader";
import RegisResep from "@/components/modal/RegisResep";

const index = () => {
  const { data, isLoading } = api.admin.getAdmin.useQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <AuthShowcase />;
  }

  return (
    <div>
      <AdminNavbar />
      <RegisResep />
      <Container>
        <AdminClient />
      </Container>
    </div>
  );
};

export default index;
