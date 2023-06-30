import React from "react";
import Navbar from "../navbar/Navbar";
import HomeHero from "./HomeHero";
import HomeNavigations from "./HomeNavigations";
import HomeProfile from "./HomePofile";
import { api } from "@/utils/api";
import HomePromosi from "./HomePromosi";
import HoomeUserFeedback from "./HoomeUserFeedback";
import Loader from "../shared/Loader";

const HomeProps = () => {
  const { data: rattings, isLoading } = api.user.getRatings.useQuery();
  const { data: promosi, isLoading: load } = api.user.getbanner.useQuery();
  if (isLoading) {
    return <Loader />;
  }

  if (load) {
    return <Loader />;
  }
  if (!rattings) {
    return <Loader />;
  }
  if (!promosi) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="py-20">
        <HomeHero />
        <HomeProfile ratings={rattings} />
        <HomeNavigations />
        <HomePromosi promosi={promosi} />
        <HoomeUserFeedback ratings={rattings} />
      </div>
    </>
  );
};

export default HomeProps;
