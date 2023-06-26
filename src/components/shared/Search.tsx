"use client";
import useSearchModal from "@/hooks/useSearchModal";
import { SearchIcon } from "lucide-react";

const Search = () => {
  const searchModal = useSearchModal();

  return (
    <div
      onClick={searchModal.onOpen}
      className="mx-auto hidden max-w-md cursor-pointer rounded-full border-[1px] py-2 shadow-sm transition hover:shadow-md sm:block"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="px-6 text-sm font-semibold">Reservations Date</div>
        <div className="hidden flex-1 border-x-[1px] px-6 text-center text-sm font-semibold sm:block">
          Add Rooms
        </div>
        <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
          <div className="hidden sm:block">Add Guest</div>
          <div className="rounded-full bg-rose-500 p-2 text-white">
            <SearchIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
