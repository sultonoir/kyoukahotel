import AvatarCom from "@/components/shared/AvatarCom";
import { Button } from "@/components/ui/button";
import { type Reservation } from "@prisma/client";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

interface Pros {
  reservation: Reservation;
}

const PrintReceipt: React.FC<Pros> = ({ reservation }) => {
  const componentRef = useRef(null);

  return (
    <div className="w-full">
      <ReactToPrint
        trigger={() => (
          <Button className="hover:bg-rose-600-600 ml-5 rounded bg-rose-500 px-8 py-2 font-bold text-white transition-all duration-150 hover:text-white hover:ring-4 hover:ring-rose-400">
            Receipt
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div className="hidden">
        <div ref={componentRef} className="grid grid-cols-1 gap-y-2 p-4">
          <div className="flex gap-2">
            <AvatarCom src={"/Logo.svg"} width={120} />
            <div className="flex flex-col">
              <p className="font-semibold">Kyouka hotel</p>
              <p className="w-[200px] text-neutral-500">
                Jl. Camplung Tanduk 4-99, Seminyak, Kec. Kuta, Kabupaten Badung,
                Bali, badung, Bali 80361
              </p>
            </div>
          </div>
          <hr />
          <hr />
          <div className="flex w-full justify-between">
            <p>Created: </p>
            <p>ReservationsId: wwoewew</p>
          </div>
          <p>Name : </p>
          <p>Name : </p>
          <p>Name : </p>
          <table className="mt-5 w-full">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <thead>
              <tr className="bg-rose-500 text-white">
                <th className="border border-gray-300 py-2">Status</th>
                <th className="border border-gray-300 py-2">Check-in</th>
                <th className="border border-gray-300 py-2">Check-out</th>
                <th className="border border-gray-300 py-2">
                  Jumlah Pembayaran
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="border border-gray-300 py-2">IsiTable Status</td>
                <td className="border border-gray-300 py-2">
                  IsiTable Check-in
                </td>
                <td className="border border-gray-300 py-2">
                  IsiTable Check-out
                </td>
                <td className="border border-gray-300 py-2">
                  IsiTable Jumlah Pembayaran
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
