"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/Container";
import { motion } from "framer-motion";
import H1 from "../shared/H1";

const HomeNavigations = () => {
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
          <div className="mt-6 grid h-[400px] grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="group relative col-span-1 h-full overflow-hidden">
              <Image
                src={`/rooms.jpg`}
                alt={`rooms`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                quality={100}
                className="duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
              <Link
                href={"/rooms"}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform items-center text-center text-2xl capitalize text-white group-hover:underline"
              >
                rooms
              </Link>
            </div>
            <div className="group relative col-span-1 h-full overflow-hidden">
              <Image
                src={`/sky.jpg`}
                alt={`rooms`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                quality={100}
                className="duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
              <Link
                href={"/facilities"}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform items-center text-center text-2xl capitalize text-white group-hover:underline"
              >
                Facilities
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default HomeNavigations;
