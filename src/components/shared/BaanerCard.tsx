import { type Banner } from "@prisma/client";
import React from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

type Props = {
  banners: Banner[];
};

const BaanerCard: React.FC<Props> = ({ banners }) => {
  const ctx = api.useContext();
  const { mutate } = api.admin.deleteBanner.useMutation({
    onSuccess: () => {
      toast.success("Banner Deleted");
      void ctx.admin.getAdmin.invalidate();
    },
  });
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
      {banners.map((banner) => {
        const onDelet = () => {
          mutate({
            id: banner.id,
          });
        };
        return (
          <div className="group sm:col-span-4 xl:col-span-2" key={banner.id}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={banner.image}
                alt={banner.title ?? ""}
                fill
                style={{ objectFit: "cover" }}
                quality={100}
                className="rounded-lg duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
              <p className="absolute bottom-5 z-10 w-full p-3 text-center text-xl text-white">
                {banner.title}
              </p>
            </div>
            <Button
              className="mt-1.5 w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={onDelet}
            >
              Delete
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default BaanerCard;
