"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";
import BluredImage from "../shared/BluredImage";
import Link from "next/link";
import Container from "../shared/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/utils/api";
import { play } from "../types";
import Search from "../shared/Search";
import Loader from "../shared/Loader";

const HomeHero = () => {
  const { data: listings, isLoading } = api.user.getAllListings.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="relative sm:aspect-video">
        <Swiper
          spaceBetween={30}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {listings?.map((listing) => (
            <SwiperSlide key={listing.id}>
              <div className="relative aspect-square overflow-hidden sm:flex  sm:flex-row sm:gap-2">
                <div className="h-full rounded-lg sm:h-1/2 sm:w-1/2">
                  <BluredImage
                    src={listing.imageSrc[0]?.img ?? ""}
                    alt={listing.title}
                    border
                  />
                </div>
                <div className="absolute bottom-2 left-1 flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-500/20 p-2 backdrop-blur-sm sm:relative sm:order-first sm:h-1/2 sm:w-1/2 sm:bg-transparent">
                  <h1
                    className={`${play.className} text-2xl font-bold md:text-5xl`}
                  >
                    <div className="hidden flex-col gap-2 capitalize sm:flex">
                      <p>Amazing suite</p>
                      <p>with offshore view</p>
                      <p>& lot of service</p>
                    </div>
                    {listing.title}
                  </h1>
                  <Link
                    href={`/rooms/${listing.title}`}
                    className="rounded-lg bg-rose-500 px-2 py-1 text-white"
                  >
                    View Rooms
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer  rounded-full hover:bg-white/75">
            <ChevronLeft size={20} />
          </div>
          <div className="swiper-button-next absolute right-2 top-1/2 z-10  -translate-y-1/2 cursor-pointer rounded-full hover:bg-white/75">
            <ChevronRight size={20} />
          </div>
        </Swiper>
      </div>
      <Search />
    </Container>
  );
};

export default HomeHero;
