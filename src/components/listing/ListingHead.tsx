import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";
import BluredImage from "../shared/BluredImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Image } from "@prisma/client";

interface ListingHeadProps {
  title: string;
  imageSrc: Image[];
}

const ListingHead: React.FC<ListingHeadProps> = ({ title, imageSrc }) => {
  return (
    <>
      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl">
        <Swiper
          spaceBetween={30}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {imageSrc &&
            imageSrc.map((img) => {
              return (
                <SwiperSlide key={img.id}>
                  <BluredImage src={img.img} alt={title} />
                </SwiperSlide>
              );
            })}
          <div className="swiper-button-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer  rounded-full hover:bg-white/75">
            <ChevronLeft size={20} />
          </div>
          <div className="swiper-button-next absolute right-2 top-1/2 z-10  -translate-y-1/2 cursor-pointer rounded-full hover:bg-white/75">
            <ChevronRight size={20} />
          </div>
        </Swiper>
      </div>
    </>
  );
};

export default ListingHead;
