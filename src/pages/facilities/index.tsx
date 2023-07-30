"use client";
import Container from "@/components/shared/Container";
import React from "react";

import Image from "next/image";
import sky from "public/sky.jpg";
import gym from "public/gym.jpg";
import cafe from "public/cafe.jpg";
import { Clock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

export const facility = [
  {
    name: "Sky Bar",
    image: sky,
    open: "4:30pm",
    close: "12am",
    desc: "We sell a wide range of alcoholic and non-alcoholic beverages for guest satisfaction. ",
  },
  {
    name: "Fitness Centre",
    image: gym,
    open: "09am",
    close: "10pm",
    desc: "Fitness Facility provides basic fitness equipment. We have a range of equipment to support your exercise and healthy lifestyle. Our fitness facility is located near the pool area to provide the best fitness access to our guests. Come and be healthy together",
  },
  {
    name: "Restaurant",
    image: cafe,
    open: "06am",
    close: "10pm",
    desc: "Promenade cafe is located in the lobby.The services served are buffet breakfast, buffet lunch and also serve a la carte. The food served is Indonesian, Chinese and European dishes.",
  },
];

const FacilityClient = () => {
  return (
    <>
      <Navbar />
      <div className="py-20">
        <Container>
          {facility.map((fas, i) => (
            <div
              className="mt-6 grid grid-cols-1 gap-5  sm:grid-cols-2"
              key={i}
            >
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-semibold capitalize">{fas.name}</p>
                <p className="text-justify text-neutral-500">{fas.desc}</p>
                <div className="flex gap-2 text-neutral-500">
                  <Clock size={25} />
                  <p>{fas.open}</p>
                  <p>:</p>
                  <p>{fas.close}</p>
                </div>
              </div>
              <div className="relative h-[300px]">
                <div className="relative h-full">
                  <Image
                    src={fas.image}
                    alt={fas.name}
                    fill
                    style={{ objectFit: "cover" }}
                    quality={100}
                    priority
                    sizes="100%"
                    className="duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
                  <p className="absolute bottom-5 z-10 w-full text-center text-xl text-white">
                    {fas.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Container>
      </div>
    </>
  );
};

export default FacilityClient;
