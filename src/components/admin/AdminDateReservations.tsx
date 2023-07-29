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
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AdminDateReservationsProps {
  price: number;
  discount: number | null | undefined;
  listingId: string;
  rooms: number;
  name: string;
  email: string;
  guestId: string;
  onBack: () => void;
}

const AdminDateReservations: React.FC<AdminDateReservationsProps> = ({
  price,
  discount,
  listingId,
  rooms,
  email,
  name,
  guestId,
  onBack,
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

  const router = useRouter();

  const { mutate } = api.admin.createReservasi.useMutation({
    onSuccess: (e: string) => {
      router.push(e);
    },
  });

  const onReservasi = () => {
    mutate({
      title: listingId,
      rooms: guestCount,
      totalPrice: calculateTotalPrice().totalPrice,
      userId: guestId,
      starDate: date?.from || new Date(),
      endDate: date?.to || new Date(),
      guestName: name,
      guestEmail: email,
      guestImage: "",
    });
  };

  return (
    <Card className="flex w-full flex-col items-center gap-5 p-4">
      <CardTitle className="text-2xl text-primary">
        {priceFormat} <span className="ml-2">/Nigth</span>
      </CardTitle>

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
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex w-full justify-between">
            <p className="text-xl">Discount</p>
            <span className="text-2xl line-through">{discount} %</span>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-xl">Total:</p>
            <span className="text-2xl line-through">{discountPrice}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between">
          <p className="text-xl">Total:</p>
          <span className="text-2xl">{totalPriceFormat}</span>
        </div>
      )}

      <CardFooter className="w-full p-0">
        <Button
          variant="outline"
          className="mr-2 w-full border border-rose-500 font-semibold text-rose-500 hover:bg-rose-500 hover:text-white"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="w-full bg-rose-600 text-white hover:bg-rose-500"
          onClick={onReservasi}
        >
          Reserve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminDateReservations;
