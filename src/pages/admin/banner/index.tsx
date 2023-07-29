import AdminNavbar from "@/components/admin/AdminNavbar";
import BannerModal from "@/components/modal/BannerModal";
import BaanerCard from "@/components/shared/BaanerCard";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data: user, isLoading } = api.admin.getAdmin.useQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (!user) {
    return <EmptyState />;
  }
  return (
    <div>
      <AdminNavbar />
      <Container>
        <BannerModal admin={user} />
        <BaanerCard banners={user.banner} />
      </Container>
    </div>
  );
};

export default index;
