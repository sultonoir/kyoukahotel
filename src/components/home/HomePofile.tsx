/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React from "react";
import Image from "next/image";
import { type Rating } from "@prisma/client";
import Container from "../shared/Container";
import H1 from "../shared/H1";
import { Star } from "lucide-react";

interface HomeProfileProps {
  ratings: Rating[];
}
const HomeProfile: React.FC<HomeProfileProps> = ({ ratings }) => {
  function hitungRataRataRating(ratings: any) {
    let totalRating = 0;
    let jumlahData = 0;

    for (let i = 0; i < ratings.length; i++) {
      totalRating += ratings[i].value;
      jumlahData++;
    }

    const rataRata = totalRating / jumlahData;
    return isNaN(rataRata) ? 0 : rataRata.toFixed(1);
  }

  const rataRataRating = hitungRataRataRating(ratings);
  return (
    <Container>
      <div className="relative flex h-[800px] flex-row gap-3">
        <div className="hidden w-1/2 flex-row items-center justify-center gap-2 sm:flex">
          <div className="relative h-[300px] w-[200px] rounded-md">
            <Image
              src={`/lobi.jpg`}
              alt="logo"
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              quality={100}
            />
          </div>
          <div className="relative h-[500px] w-[200px] rounded-md">
            <Image
              src={`/sky.jpg`}
              alt="logo"
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              quality={100}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center sm:w-1/2">
          <H1>Welcome to our</H1>
          <H1>KyOuka Hotel</H1>
          <p className="text-justify indent-8 text-xl">
            Lets find an unforgettable stay at Kyouka Hotel! Enjoy unparalleled
            luxury and comfort in an elegant setting and high-quality service.
            With a strategic location in the city center, Kyouka Hotel is the
            ideal choice for your business and leisure trips. With modern
            facilities, mouth-watering restaurants and scenic views, we
            guarantee a satisfying stay. Immediately book your room at Kyouka
            Hotel and feel our warm hospitality and attention to every detail to
            fulfill your needs. Welcome to the world of unrivaled luxury at
            Kyouka Hotel!
          </p>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-2">
              <Star size={30} className="text-rose-500" />
              <p className={`text-3xl`}>{rataRataRating}</p>
            </div>
            <p className="text-xl capitalize">user ratings</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeProfile;
