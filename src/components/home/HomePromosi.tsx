"use client";
import { type Banner } from "@prisma/client";
import Image from "next/image";
import React from "react";
import Container from "../shared/Container";
import { motion } from "framer-motion";
import H1 from "../shared/H1";
interface HomePromosiProps {
  promosi: Banner[];
}

const HomePromosi: React.FC<HomePromosiProps> = ({ promosi }) => {
  return (
    <Container>
      <motion.div
        className="mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <H1>special offers</H1>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
          {promosi.map((promo) => (
            <div
              className="group h-[300px] overflow-hidden rounded-xl border shadow-sm sm:col-span-4 xl:col-span-2"
              key={promo.id}
            >
              <div className="relative h-full">
                <Image
                  src={promo.image}
                  alt={promo.title || ""}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={100}
                  sizes="100%"
                  className="duration-700 ease-in-out group-hover:scale-110"
                />
                <p className="absolute bottom-5 z-10 w-full text-center text-xl text-white">
                  {promo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Container>
  );
};

export default HomePromosi;
