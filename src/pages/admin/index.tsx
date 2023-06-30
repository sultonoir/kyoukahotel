import AdminNavbar from "@/components/admin/AdminNavbar";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import { api } from "@/utils/api";
import React from "react";
import AdminClient from "../../components/columnadmin/AdminClient";
import AuthShowcase from "@/components/form/AuthShowcase";
import Loader from "@/components/shared/Loader";

const index = () => {
  const { isLoading, data } = api.user.getUser.useQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <AuthShowcase />;
  }

  if (data?.role !== "admin") {
    return (
      <EmptyState
        title="You are not have access"
        subtitle="is'n admin"
        showReset
      />
    );
  }

  return (
    <div>
      <AdminNavbar />
      <Container>
        <AdminClient />
      </Container>
    </div>
  );
};

export default index;
