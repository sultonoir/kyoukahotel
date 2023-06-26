import React from "react";
import Navbar from "../navbar/Navbar";
import HomeHero from "./HomeHero";
import HomeNavigations from "./HomeNavigations";
import HomeProfile from "./HomePofile";
import { api } from "@/utils/api";
import HomePromosi from "./HomePromosi";
import HoomeUserFeedback from "./HoomeUserFeedback";

const HomeProps = () => {
  const { data: rattings } = api.user.getRatings.useQuery();
  const { data: promosi } = api.user.getbanner.useQuery();
  if (!rattings) {
    return null;
  }
  if (!promosi) {
    return null;
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
