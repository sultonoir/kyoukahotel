/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  type User,
  type Image,
  type Listing,
  type Fasilitas,
  type Reservation,
} from "@prisma/client";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Autoplay, Pagination, Navigation } from "swiper";

import BluredImage from "../shared/BluredImage";
import Link from "next/link";
import {
  BedDouble,
  ChevronLeft,
  DoorClosedIcon,
  Loader2,
  ScrollTextIcon,
  TrashIcon,
  User2Icon,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { play } from "../types";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import EditListingModal from "../modal/EditListingModal";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Rattings from "../shared/Rattings";

interface ListingCardProps {
  listing: Listing & {
    user: User | null;
    fasilitas: Fasilitas[];
    imageSrc: Image[];
  };
  admin?: boolean;
  pending?: boolean;
  success?: boolean;
  completed?: boolean;
  rating?: boolean;
  reservation?: Reservation & {
    listing: Listing & {
      user: User | null;
      fasilitas: Fasilitas[];
      imageSrc: Image[];
    };
  };
}
const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  admin,
  reservation,
  pending,
  completed,
  rating,
}) => {
  const router = useRouter();
  const { mutate } = api.listings.deleteListing.useMutation({
    onSuccess: () => {
      toast.success("Property deleted");
    },
  });

  const deleted = (id: string, listingId: string) => {
    mutate({ userId: id, listingId });
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

  const { mutate: invoice, isLoading: loading } =
    api.user.getInvoice.useMutation({
      onSuccess: (e) => {
        router.push(e ?? "");
      },
    });

  const getInvoice = () => {
    invoice({
      reservationsId: reservation?.id ?? "",
    });
  };

  const { mutate: onlyInvoice, isLoading: load } =
    api.user.onlyInvoice.useMutation({
      onSuccess: (e) => {
        router.push(e ?? "");
      },
    });

  const only = () => {
    onlyInvoice({
      id: reservation?.id ?? "",
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
        {reservation ? (
          <div className="flex flex-col">
            <p>
              {format(reservation.startDate, "PP")} -
              {format(reservation.endDate, "PP")}
            </p>
            <p className="text-neutral-500">
              {reservation.rooms} <span>Rooms</span>
            </p>
          </div>
        ) : (
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
            {admin && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <DoorClosedIcon size={20} className="text-rose-500" />
                  <p>{listing.roomCount}</p>
                </div>
                <p className="capitalize">rooms</p>
              </div>
            )}
          </div>
        )}

        <CardDescription className="text-lg text-primary">
          {price}
        </CardDescription>
      </CardHeader>
      {admin && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Button
              onClick={() => deleted(listing.userId ?? "", listing.id)}
              variant={"ghost"}
              className="w-full"
              title="Property"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <EditListingModal listingId={listing.id} listings={listing} />
          </div>
        </CardFooter>
      )}
      {pending && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Button
              disabled={loading}
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={getInvoice}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <ScrollTextIcon className="mr-2 h-4 w-4" />
                  invoice
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
      {rating && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Rattings id={reservation?.id ?? ""} reservation={reservation} />
            <Button
              disabled={load}
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={only}
            >
              {load ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <ScrollTextIcon className="mr-2 h-4 w-4" />
                  invoice
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
      {completed && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Button
              disabled={load}
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={only}
            >
              {load ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <ScrollTextIcon className="mr-2 h-4 w-4" />
                  invoice
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ListingCard;
