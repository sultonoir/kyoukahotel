import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";
import RattingsClient from "../../../components/columrating/RattingsClient";

const index = () => {
  const { data, isLoading } = api.admin.getAdmin.useQuery();

  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <Loader />;
  }
  return <RattingsClient rattings={data.rating} />;
};

export default index;
