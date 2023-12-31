/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MinusCircleIcon,
  PlusCircle,
} from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";
import useLoginModal from "@/hooks/useLoginModal";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ListingReservationProps {
  price: number;
  discount: number | null | undefined;
  listingId: string;
  rooms: number;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  discount,
  listingId,
  rooms,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  const [guestCount, setGuestCount] = React.useState(1);

  const calculateSelectedDays = () => {
    if (date?.from && date?.to) {
      const differenceInDays = Math.floor(
        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      return differenceInDays;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const totalPrice = calculateSelectedDays() * price * guestCount;
    let discountedPrice = totalPrice;

    if (discount && discount > 0) {
      const discountAmount = (totalPrice * discount) / 100;
      discountedPrice = totalPrice - discountAmount;
    }

    return {
      totalPrice,
      discountedPrice,
    };
  };

  const increaseGuestCount = () => {
    if (guestCount < rooms) {
      setGuestCount((prevCount) => prevCount + 1);
    }
  };

  const decreaseGuestCount = () => {
    if (guestCount > 1) {
      setGuestCount((prevCount) => prevCount - 1);
    }
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const totalPriceFormat = formatter.format(calculateTotalPrice().totalPrice);
  const priceFormat = formatter.format(price);
  const discountPrice = formatter.format(calculateTotalPrice().discountedPrice);

  const displayDiscount = React.useMemo(() => {
    if (discount && discount > 0) {
      const discountPrice = (price * discount) / 100;
      const disountDecerment = price - discountPrice;
      const discountPriceFormat = formatter.format(disountDecerment);
      return discountPriceFormat;
    }
  }, [discount, price]);

  const loginModal = useLoginModal();
  const router = useRouter();
  const { data: user } = api.user.getUser.useQuery();
  const { mutate } = api.user.createReservasi.useMutation({
    onSuccess: () => {
      toast.success("Reservasi created");
      router.push("/payment");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onDiscount = () => {
    mutate({
      title: listingId,
      rooms: guestCount,
      totalPrice: calculateTotalPrice().discountedPrice,
      userId: user?.email ?? "",
      starDate: date?.from as Date,
      endDate: date?.to as Date,
      guestName: user?.name ?? "",
      guestEmail: user?.email,
      guestImage: user?.image as string,
      adminId: user?.adminId as string,
    });
  };

  const onReservasi = () => {
    mutate({
      title: listingId,
      rooms: guestCount,
      totalPrice: calculateTotalPrice().totalPrice,
      userId: user?.email ?? "",
      starDate: date?.from || new Date(),
      endDate: date?.to || new Date(),
      guestName: user?.name ?? "",
      guestEmail: user?.email,
      guestImage: user?.image ?? "",
      adminId: user?.adminId ?? "",
    });
  };

  const onPayment = () => {
    if (discount && discount > 0) {
      return onDiscount();
    } else {
      onReservasi();
    }
  };

  return (
    <Card className="flex w-full flex-col items-center gap-5 p-4">
      {discount ? (
        <CardTitle className="text-2xl text-primary">
          {displayDiscount} <span className="ml-2">/Nigth</span>
        </CardTitle>
      ) : (
        <CardTitle className="text-2xl text-primary">
          {priceFormat} <span className="ml-2">/Nigth</span>
        </CardTitle>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-center text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <div className="font-medium">Rooms</div>
          <div className="font-light text-gray-600">How many rooms</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={decreaseGuestCount}
          >
            <MinusCircleIcon size={24} />
          </Button>
          <span className="text-2xl">{guestCount}</span>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={increaseGuestCount}
          >
            <PlusCircle />
          </Button>
        </div>
      </div>
      {discount ? (
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full justify-between">
            <p className="text-xl text-neutral-500">Discount</p>
            <span className="text-2xl ">- {discount} %</span>
          </div>
          <p className="flex items-end justify-end text-neutral-500 line-through">
            {totalPriceFormat}
          </p>
          <div className="flex w-full justify-between">
            <p className="text-xl text-neutral-500">Total:</p>
            <span className="font text-2xl font-semibold">{discountPrice}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between">
          <p className="text-xl text-neutral-500">Total:</p>
          <span className="text-2xl font-semibold">{totalPriceFormat}</span>
        </div>
      )}

      <CardFooter className="w-full p-0">
        {user ? (
          <Button
            className="w-full bg-rose-600 text-white hover:bg-rose-500"
            onClick={onPayment}
          >
            Reserve
          </Button>
        ) : (
          <Button
            className="w-full bg-rose-600 text-white hover:bg-rose-500"
            onClick={loginModal.onOpen}
          >
            Reserve
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ListingReservation;
