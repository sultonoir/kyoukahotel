import { type Banner } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import ImagePromosiUpload from "./ImagePromosiUpload";
import { toast } from "react-hot-toast";

type Props = {
  banners: Banner[];
};

const BaanerCard: React.FC<Props> = ({ banners }) => {
  const [ban, setBan] = useState(banners);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const { mutate: create, isLoading } = api.user.createBanner.useMutation({
    onSuccess: (e) => {
      toast.success("Banner created");
      setBan(e.banner);
    },
  });

  const { data } = api.user.getUser.useQuery();

  const onsubmit = () => {
    create({
      image,
      title,
      email: data?.email ?? "",
    });
  };
  const ctx = api.useContext();
  const { mutate } = api.user.deleteBanner.useMutation({
    onSuccess: (e) => {
      setBan(e.banner);
      void ctx.user.invalidate();
    },
  });
  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="mt-4">
          <Button variant="outline">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create banner
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create banner promosi</DialogTitle>
            <DialogDescription>
              This action for create banner promosi
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Title">Title</Label>
              <Input
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="">
              <ImagePromosiUpload value={image} onChange={(e) => setImage(e)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-rose-600 text-white hover:bg-rose-500"
              onClick={onsubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>Create</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
        {ban.map((banner) => {
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
                <p className="absolute bottom-5 z-10 w-full text-center text-xl text-white">
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
    </>
  );
};

export default BaanerCard;
