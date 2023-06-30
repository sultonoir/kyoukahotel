import AdminNavbar from "@/components/admin/AdminNavbar";
import BaanerCard from "@/components/shared/BaanerCard";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data: user, isLoading } = api.user.getUser.useQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (!user || user.role !== "admin") {
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
        <BaanerCard banners={user.banner} />
      </Container>
    </div>
  );
};

export default index;
