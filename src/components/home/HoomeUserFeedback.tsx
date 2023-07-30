import React from "react";
import Container from "../shared/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";
import { type User, type Rating } from "@prisma/client";
import { motion } from "framer-motion";
import H1 from "../shared/H1";
import AvatarMenu from "../navbar/AvatarMenu";
import { Card } from "../ui/card";
import { format } from "date-fns";

interface HoomeUserFeedbackProps {
  ratings: Array<
    Rating & {
      user: User | null;
    }
  >;
}

const HoomeUserFeedback: React.FC<HoomeUserFeedbackProps> = ({ ratings }) => {
  const truncateString = (str: string, num: number) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };
  return (
    <div className="my-10 bg-[#F5F5F5]">
      <motion.div
        className="flex flex-col gap-5 py-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <H1>User Feedback</H1>
        <Container>
          <Swiper
            slidesPerView={3}
            loop
            spaceBetween={30}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              800: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
            }}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            autoplay={true}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {ratings.map((rating) => (
              <SwiperSlide
                key={rating.id}
                className="flex flex-col items-center justify-center gap-5"
              >
                <Card className="h-[150px] p-2">
                  <div className=" mx-auto flex items-center gap-2">
                    <div className="relative h-10 w-10">
                      <AvatarMenu
                        src={rating.guestImage || rating.user?.image}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="w-full capitalize">{rating.guestName}</p>
                      <p className="text-xs text-neutral-500">
                        {format(rating.createdAt, "PP")}
                      </p>
                    </div>
                  </div>
                  <blockquote className="border-l-2 pl-6 italic">
                    `{truncateString(rating.message, 140)}`
                  </blockquote>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </motion.div>
    </div>
  );
};

export default HoomeUserFeedback;
