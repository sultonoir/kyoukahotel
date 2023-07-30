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

  const { data: listings, isLoading: isload } =
    api.user.getAllListings.useQuery();

  if (isload) {
    return <Loader />;
  }

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
  if (!listings) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="py-20">
        <HomeHero listings={listings} />
        <HomeProfile ratings={rattings} />
        <HomeNavigations listings={listings} />
        <HomePromosi promosi={promosi} />
        <HoomeUserFeedback ratings={rattings} />
      </div>
    </>
  );
};

export default HomeProps;
