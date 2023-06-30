import React from "react";
import Container from "../shared/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";
import { type Rating } from "@prisma/client";
import { motion } from "framer-motion";
import H1 from "../shared/H1";
import AvatarMenu from "../navbar/AvatarMenu";

interface HoomeUserFeedbackProps {
  ratings: Rating[];
}

const HoomeUserFeedback: React.FC<HoomeUserFeedbackProps> = ({ ratings }) => {
  console.log();
  return (
    <div className="mt-10 bg-[#F5F5F5]">
      <motion.div
        className="flex flex-col gap-5 pt-5"
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
                className="flex flex-col items-center justify-center gap-5 p-2"
              >
                <div className="relative mx-auto h-10 w-10">
                  <AvatarMenu src={rating.guestImage} />
                </div>
                <blockquote className=" border-l-2 pl-6 italic">
                  `{rating.message}`
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </motion.div>
    </div>
  );
};

export default HoomeUserFeedback;
