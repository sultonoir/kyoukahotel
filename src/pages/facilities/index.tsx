"use client";
import Container from "@/components/shared/Container";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import sky from "public/sky.jpg";
import gym from "public/gym.jpg";
import cafe from "public/cafe.jpg";
import { Clock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

const facility = [
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
      <div className="pt-20">
        <Container>
          <div className="mt-6 grid grid-cols-1 gap-5  sm:grid-cols-8">
            {facility.map((fas) => (
              <Dialog key={fas.name}>
                <DialogTrigger
                  className="group h-[300px] overflow-hidden rounded-xl border shadow-sm sm:col-span-4 xl:col-span-2"
                  key={fas.name}
                >
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
                </DialogTrigger>
                <DialogContent className="w-[990px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{fas.name}</DialogTitle>
                    <div className="flex justify-center justify-items-center gap-5">
                      <Clock size={24} />
                      <DialogDescription className="text-primary">
                        {fas.open}
                      </DialogDescription>
                      <DialogDescription className="text-primary">
                        {" "}
                        -{" "}
                      </DialogDescription>
                      <DialogDescription className="text-primary">
                        {fas.close}
                      </DialogDescription>
                    </div>
                    <DialogDescription className="text-primary">
                      {fas.desc}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default FacilityClient;
