import {
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
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import EditListingModal from "../modal/EditListingModal";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Rattings from "../shared/Rattings";
import PrintReceipt from "../shared/PrintReceipt";

interface ListingCardProps {
  listing: Listing & {
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
      fasilitas: Fasilitas[];
      imageSrc: Image[];
    };
  };
}
const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  admin,
  reservation,
  completed,
  rating,
  pending,
}) => {
  const ctx = api.useContext();
  const router = useRouter();
  const { mutate } = api.listings.deleteListing.useMutation({
    onSuccess: () => {
      toast.success("Property deleted");
      void ctx.admin.getAllRooms.invalidate();
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

  const priceDiscount = useMemo(() => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    if (listing.discount && listing.discount > 0) {
      const discountAmount = (listing.price * listing.discount) / 100;
      const discount = listing.price - discountAmount;
      const displayDiscount = formatter.format(discount);
      return displayDiscount;
    }
  }, [listing.discount, listing.price]);

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
        <CardTitle
          className={`font-normal capitalize hover:text-rose-500 hover:underline`}
        >
          <Link href={`/rooms/${listing.title}`}>{listing.title}</Link>
        </CardTitle>

        {listing.discount && listing.discount > 0 ? (
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-primary">
              {priceDiscount}
            </p>
            <div className="flex gap-2">
              <p className="rounded-lg bg-rose-300 px-2 text-destructive">
                - {listing.discount} %
              </p>
              <p className="font-normal text-neutral-500 line-through">
                {price}
              </p>
            </div>
          </div>
        ) : (
          <CardDescription className="text-lg font-semibold text-primary">
            {price}
          </CardDescription>
        )}

        {reservation ? (
          <div className="flex flex-col">
            <p>
              {format(reservation.startDate, "PP")} -
              {format(reservation.endDate, "PP")}
            </p>
            <p className="text-neutral-500">
              {reservation.rooms}{" "}
              <span className="text-neutral-500">Rooms</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <BedDouble size={20} className="text-rose-500" />
                <p>{listing.bed}</p>
              </div>
              <p className="capitalize text-neutral-500">bed</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <User2Icon size={20} className="text-rose-500" />
                <p>{listing.guestCount}</p>
              </div>
              <p className="capitalize text-neutral-500">guest max</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <DoorClosedIcon size={20} className="text-rose-500" />
                <p>{listing.roomCount}</p>
              </div>
              <p className="capitalize text-neutral-500">rooms</p>
            </div>
          </div>
        )}
      </CardHeader>
      {admin && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Button
              onClick={() => deleted(listing.adminId ?? "", listing.id)}
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
      {pending && reservation && (
        <CardFooter className="flex flex-col items-center gap-2">
          <PrintReceipt reservation={reservation} />
        </CardFooter>
      )}
      {rating && (
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Rattings id={reservation?.id ?? ""} reservation={reservation} />
            {/* <Button
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
            </Button> */}
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
      {pending && <div></div>}
    </Card>
  );
};

export default ListingCard;
