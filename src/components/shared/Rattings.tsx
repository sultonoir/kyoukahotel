import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type Fasilitas,
  type Image,
  type Listing,
  type Reservation,
} from "@prisma/client";
import { Button } from "../ui/button";
import { Loader2, StarIcon } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Counter from "./Counter";

interface RattingsProps {
  id: string;
  reservation?: Reservation & {
    listing: Listing & {
      fasilitas: Fasilitas[];
      imageSrc: Image[];
    };
  };
}

const Rattings: React.FC<RattingsProps> = ({ reservation, id }) => {
  const ctx = api.useContext();
  const [value, setValue] = useState(1);
  const [message, setMessage] = useState("");
  const { mutate, isLoading } = api.user.createRating.useMutation({
    onSuccess: () => {
      toast.success("Ratting created");
      void ctx.user.invalidate();
    },
  });

  const createRating = () => {
    mutate({
      id,
      name: reservation?.guestName ?? "",
      value,
      image: reservation?.guestImage ?? "",
      userId: reservation?.userId ?? "",
      message,
      listingId: reservation?.listingId ?? "",
      email: reservation?.guestEmail ?? "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button className="w-full bg-rose-600 text-white hover:bg-rose-500">
          <StarIcon className="mr-2" />
          Rattings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rattings</DialogTitle>
          <DialogDescription>
            We would really appreciate it if you give a ratings
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <Counter
            title="Rattings"
            subtitle="the maximum value is 5"
            value={value}
            max={5}
            onChange={(e) => setValue(e)}
          />
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Message">Message</Label>
            <Textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full bg-rose-600 text-secondary hover:bg-rose-500"
            onClick={createRating}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <StarIcon className="mr-2" />
                Rattings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Rattings;
