import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";
import RattingsClient from "./RattingsClient";

const index = () => {
  const { data } = api.user.getUser.useQuery();

  if (!data) {
    return <Loader />;
  }
  return <RattingsClient rattings={data.rating} />;
};

export default index;
