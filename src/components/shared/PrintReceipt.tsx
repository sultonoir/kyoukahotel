import AvatarCom from "@/components/shared/AvatarCom";
import { Button } from "@/components/ui/button";
import {
  type Fasilitas,
  type Image,
  type Listing,
  type Reservation,
} from "@prisma/client";
import { format } from "date-fns";
import { ScrollTextIcon } from "lucide-react";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

interface Pros {
  reservation: Reservation & {
    listing: Listing & {
      fasilitas: Fasilitas[];
      imageSrc: Image[];
    };
  };
}

const PrintReceipt: React.FC<Pros> = ({ reservation }) => {
  const componentRef = useRef(null);
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  const total = formatter.format(reservation.totalPrice);
  return (
    <div className="w-full">
      <ReactToPrint
        trigger={() => (
          <Button className="hover:bg-rose-600-600 w-full rounded bg-rose-500 px-8 py-2 font-bold text-white transition-all duration-150 hover:text-white hover:ring-4 hover:ring-rose-400">
            <ScrollTextIcon className="mr-2" />
            Receipt
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div className="hidden">
        <div ref={componentRef} className="grid grid-cols-1 gap-y-2 p-4">
          <div className="flex gap-2">
            <AvatarCom src={"/Logo.svg"} width={120} />
            <div className="flex flex-grow flex-col items-center">
              <p className="font-semibold">Kyouka hotel</p>
              <p className="w-[300px] text-neutral-500">
                Jl. Camplung Tanduk 4-99, Seminyak, Kec. Kuta, Kabupaten Badung,
                Bali, badung, Bali 80361
              </p>
            </div>
          </div>
          <hr />
          <hr />
          <div className="flex w-full justify-between">
            <p>Created: {format(reservation.createdAt, "PPP")} </p>
            <p>ReservationsId: {reservation.id}</p>
          </div>
          <p>Name : {reservation.guestName} </p>
          <p>Email : {reservation.guestEmail}</p>
          <table className="mt-5 w-full">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr className="bg-rose-500 text-white">
                <th className="border border-gray-300 py-2">Status</th>
                <th className="border border-gray-300 py-2">Check-in</th>
                <th className="border border-gray-300 py-2">Check-out</th>
                <th className="border border-gray-300 py-2">Rooms</th>
                <th className="border border-gray-300 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="border border-gray-300 py-2">
                  {reservation.status}
                </td>
                <td className="border border-gray-300 py-2">
                  {format(reservation.startDate, "PPP")}
                </td>
                <td className="border border-gray-300 py-2">
                  {format(reservation.endDate, "PPP")}
                </td>
                <td className="border border-gray-300 py-2">
                  {reservation.rooms}
                </td>
                <td className="border border-gray-300 py-2">{total}</td>
              </tr>
            </tbody>
          </table>
          <span>Thank you for payment</span>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
