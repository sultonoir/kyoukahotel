import AdminNavbar from "@/components/admin/AdminNavbar";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import SettingAdmin from "@/components/shared/SettingsAdmin";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data, isLoading } = api.admin.getAdmin.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <EmptyState />;
  }
  return (
    <>
      <AdminNavbar />
      <SettingAdmin data={data} />;
    </>
  );
};

export default index;
