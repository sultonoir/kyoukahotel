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
import React, { useEffect, useMemo, useState } from "react";
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
import { format } from "date-fns";
import { play } from "../types";
import { Button } from "../ui/button";

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

  const { mutate: createPayment } = api.user.createPayment.useMutation({
    onSuccess: (e) => {
      window.location.href = e ?? "";
    },
  });
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

  const { mutate: delOtomastis } = api.user.deleteReservasi.useMutation();

  const deletOtomatis = () => {
    delOtomastis({
      listingId: listing.id,
      reservationsId: reservation?.id ?? "",
      rooms: reservation?.rooms ?? 0,
    });
  };

  const jalankanDeleteReservasiSetelahSatuMenit = () => {
    // Membuat time stamp 1 menit yang lalu
    const satuMenitYangLalu = new Date(reservation?.createdAt ?? new Date());
    satuMenitYangLalu.setMinutes(satuMenitYangLalu.getMinutes() - 1);

    // Mendapatkan waktu saat ini
    const waktuSaatIni = new Date();

    // Memeriksa apakah sudah satu menit sejak waktu satu menit yang lalu
    if (waktuSaatIni > satuMenitYangLalu) {
      deletOtomatis();
    } else {
      // Menunggu satu menit sebelum menjalankan deletOtomatis
      const timeoutId = setTimeout(deletOtomatis, 60000); // 60000 milidetik = 1 menit

      // Membersihkan timeout saat komponen unmount
      return () => clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    let timerId: any;

    // Memanggil fungsi jalankanDeleteReservasiSetelahSatuMenit
    const jalankanTimeout = () => {
      timerId = jalankanDeleteReservasiSetelahSatuMenit();
    };

    // Memanggil jalankanTimeout setelah 1 menit (60000 milidetik)
    const timeoutId = setTimeout(jalankanTimeout, 60000);

    // Membersihkan timer saat komponen unmount
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timerId);
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/midtrans", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization:
            "Basic U0ItTWlkLXNlcnZlci1HRkFPQWczc1ZmU2F3X3IwZmlNLTFINmU6",
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: reservation?.id,
            gross_amount: reservation?.totalPrice,
          },
          customer_details: {
            first_name: "Budi",
            last_name: "Utomo",
            email: "budi.utomo@midtrans.com",
            phone: "081223323423",
          },
          credit_card: { secure: true },
        }),
      });

      const data = await response.json();
      window.location.href = data.redirect_url;
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPayment = () => {
    createPayment({
      title: listing.title,
      userName: reservation?.guestName ?? "",
      images: [listing.imageSrc[0]?.img ?? ""],
      userEmail: reservation?.guestEmail ?? "",
      price: reservation?.totalPrice ?? 0,
      rooms: reservation?.rooms ?? 0,
      reservationsId: reservation?.id ?? "",
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
            title="Delete Reservation"
            className=" bg-rose-600 text-white hover:bg-rose-500"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            className="w-full hover:bg-rose-600/25"
            variant={"outline"}
            onClick={onPayment}
          >
            <Banknote className="mr-2 h-4 w-4" />
            pay
          </Button>
        </div>
        <Button
          disabled={loading}
          className="w-full"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handlePayment}
        >
          Pay with midtrans
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingPayment;
