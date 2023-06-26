import AdminNavbar from "@/components/admin/AdminNavbar";
import BaanerCard from "@/components/shared/BaanerCard";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data: user } = api.user.getUser.useQuery();
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