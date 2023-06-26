import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { Label } from "../ui/label";
import ImagePromosiUpload from "../shared/ImagePromosiUpload";

const BannerModal = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const { mutate, isLoading } = api.user.createBanner.useMutation({
    onSuccess: () => {
      toast.success("Banner created");
    },
  });

  const { data } = api.user.getUser.useQuery();

  const onsubmit = () => {
    mutate({
      image,
      title,
      email: data?.email ?? "",
    });
  };

  return (
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
  );
};

export default BannerModal;
