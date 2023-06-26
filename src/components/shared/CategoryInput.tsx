// File: CategoryInput.tsx
import { type Listing } from "@prisma/client";
import React from "react";

type Props = {
  label: string;
  selected?: boolean;
  onClick: (value: Listing) => void;
  item: Listing;
};

const CategoryInput = ({ label, selected, onClick, item }: Props) => {
  return (
    <div
      onClick={() => onClick({ ...item })}
      className={`
        flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition hover:border-black
        ${selected ? "border-black" : "border-neutral-200"}
      `}
    >
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
