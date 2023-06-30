/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { api } from "@/utils/api";
import {
  type Fasilitas,
  type Image,
  type Listing,
  type Reservation,
  type User,
} from "@prisma/client";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import BluredImage from "../shared/BluredImage";
import {
  Banknote,
  BedDouble,
  ChevronLeft,
  TrashIcon,
  User2Icon,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { add, format } from "date-fns";
import { play } from "../types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: Listing & {
    user: User | null;
    fasilitas: Fasilitas[];
    imageSrc: Image[];
  };
  reservation: Reservation & {
    listing: Listing & {
      user: User | null;
      fasilitas: Fasilitas[];
      imageSrc: Image[];
    };
  };
}

const ListingPayment: React.FC<ListingCardProps> = ({
  reservation,
  listing,
}) => {
  const { mutate: delet, isLoading } = api.user.deleteReservasi.useMutation({
    onSuccess: () => {
      toast.success("Reservation deleted");
    },
  });

  const deleteReservasi = () => {
    delet({
      listingId: listing.id,
      reservationsId: reservation?.id ?? "",
      rooms: reservation?.rooms ?? 0,
    });
  };

  const price = useMemo(() => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    if (reservation) {
      const formattedPrice = formatter.format(reservation.totalPrice);
      return formattedPrice;
    }

    const formattedPrice = formatter.format(listing.price);
    return formattedPrice;
  }, [listing.price, reservation]);

  useEffect(() => {
    const durasi = { minutes: 1 };
    const adds = add(reservation.startDate, durasi);
    const newdate = new Date();
    const expire = newdate > adds;

    if (expire) {
      deleteReservasi();
    }
  }, [reservation.startDate]);

  const router = useRouter();
  const { mutate: midtrans, isLoading: loading } =
    api.user.createMidtrans.useMutation({
      onSuccess: (e) => {
        router.push(e);
      },
    });
  const handlePayment = () => {
    midtrans({
      name: reservation.guestName ?? "",
      id: reservation.id ?? "",
      email: reservation.guestEmail ?? "",
      totalPrice: reservation.totalPrice ?? 0,
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl border shadow-sm sm:col-span-4 xl:col-span-2">
      <CardContent className="pb-0 pt-6">
        <div className="relative aspect-video w-full overflow-hidden">
          <Swiper
            spaceBetween={10}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {listing.imageSrc.map((img) => (
              <SwiperSlide key={img.id}>
                <Link href={`/rooms/${listing.title}`}>
                  <BluredImage src={img.img} alt={listing.title} border />
                </Link>
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
      </CardContent>
      <CardHeader>
        <Link href={`/rooms/${listing.title}`}>
          <CardTitle
            className={`${play.className} capitalize hover:text-rose-500 hover:underline`}
          >
            {listing.title}
          </CardTitle>
        </Link>
        <div className="flex flex-col">
          <p>
            {format(reservation.startDate, "PP")} -
            {format(reservation.endDate, "PP")}
          </p>
          <p className="text-neutral-500">
            {reservation.rooms} <span>Rooms</span>
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <BedDouble size={20} className="text-rose-500" />
              <p>{listing.bed}</p>
            </div>
            <p className="capitalize">bed</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <User2Icon size={20} className="text-rose-500" />
              <p>{listing.guestCount}</p>
            </div>
            <p className="capitalize">guest max</p>
          </div>
        </div>
        <CardDescription className="text-lg text-primary">
          {price}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-center gap-2">
        <div className="flex w-full items-center gap-2">
          <Button
            disabled={isLoading}
            onClick={deleteReservasi}
            variant={"outline"}
            title="Delete Reservation"
            className="border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            className="w-full bg-rose-600 text-secondary hover:bg-rose-500"
            disabled={loading}
            onClick={handlePayment}
          >
            <Banknote className="mr-2 h-4 w-4" />
            pay
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingPayment;
