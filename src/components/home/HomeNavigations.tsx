/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React from "react";
import Link from "next/link";
import Container from "../shared/Container";
import { motion } from "framer-motion";
import H1 from "../shared/H1";
import {
  type Rating,
  type Fasilitas,
  type Image,
  type Listing,
} from "@prisma/client";
import BluredImage from "../shared/BluredImage";
import { Star, User2Icon } from "lucide-react";

interface Props {
  listings: Array<
    Listing & {
      imageSrc: Image[];
      fasilitas: Fasilitas[];
      rating: Rating[];
    }
  >;
}

const HomeNavigations: React.FC<Props> = ({ listings }) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

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

  return (
    <div className="bg-[#F5F5F5] p-5 pb-20">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <H1>explore our hotel</H1>
          <div className="mt-6 grid h-[500px] grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2">
            {listings.map((listing) => {
              const price = formatter.format(listing.price);
              const rataRataRating = hitungRataRataRating(listing.rating);
              return (
                <div key={listing.id} className="group relative">
                  <div className="relative h-full duration-700 ease-in-out group-hover:h-3/4">
                    <BluredImage
                      src={listing.imageSrc[0]?.img as string}
                      alt={listing.title}
                    />
                    <div className="absolute bottom-10 left-10 flex flex-col items-center justify-center gap-2">
                      <span className="bg-rose-600 px-2 py-1 text-white">
                        {price}
                      </span>
                      <Link
                        href={`/rooms/${listing.title}`}
                        className="bg-white px-2 py-1 text-2xl font-semibold capitalize"
                      >
                        {listing.title}
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 bg-white opacity-0 duration-700 ease-in group-hover:opacity-100">
                    <div className="flex w-full items-center justify-center p-2">
                      <p className="text-xl">{rataRataRating}</p>
                      <Star size={27} className="ml-2 text-rose-500" />
                    </div>
                    <div className="flex w-full items-center justify-center p-2">
                      <p className="text-xl">{listing.rating.length}</p>
                      <User2Icon size={27} className="ml-2 text-rose-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default HomeNavigations;
