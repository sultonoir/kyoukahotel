import { BedDouble, Check, User2 } from "lucide-react";
import { play } from "../types";
import { type Fasilitas } from "@prisma/client";

interface ListingInfoProps {
  title: string;
  description: string;
  guestCount: number;
  roomCount: number;
  fasilitas: Fasilitas[];
  bed: number;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  description,
  guestCount,
  fasilitas,
  title,
  bed,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div
            className={`flex flex-col text-xl font-semibold capitalize lg:flex-row ${play.className}`}
          >
            <p>{title}.</p>
          </div>
          <div className="flex flex-row items-center justify-evenly gap-5">
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <User2 size={20} className="text-rose-500" />
              <p className="text-neutral-500">{guestCount} Person</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <BedDouble size={20} className="text-rose-500" />
              <p className="text-neutral-500"> {bed} Bed</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="text-justify indent-8 text-lg">{description}</div>
      <hr />
      <p className={`${play.className} text-xl font-semibold`}>Fasilitas</p>
      <div className="grid grid-cols-2 gap-x-5 gap-y-2">
        {fasilitas &&
          fasilitas.map((fas) => (
            <ul key={fas.id}>
              <li className="flex flex-row gap-x-2">
                <Check />
                <p className="capitalize">{fas.fasilitas}</p>
              </li>
            </ul>
          ))}
      </div>
      <hr />
    </div>
  );
};

export default ListingInfo;
