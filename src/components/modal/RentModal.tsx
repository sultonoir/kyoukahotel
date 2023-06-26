import React, { useState } from "react";
enum STEPS {
  INFO = 1,
  IMAGES = 2,
  FASILITAS = 3,
  DESCRIPTION = 4,
  DISCOUNT = 5,
  PRICE = 6,
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import ImageUpload from "../shared/ImageUpload";
import Facility from "../shared/Facility";
import { Textarea } from "../ui/textarea";
import ImagePromosiUpload from "../shared/ImagePromosiUpload";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const RentModal = () => {
  const [step, setStep] = useState(STEPS.INFO);
  const [title, setTitle] = useState("");
  const [bed, setBed] = useState("1");
  const [roomCount, setRoomCount] = useState("1");
  const [description, setDescription] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [image, setImage] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [imagePromosi, setImagePromosi] = useState("");
  const [fasilitas, setFasilitas] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [descError, setDescError] = useState("");
  const ctx = api.useContext();
  const { data } = api.user.getUser.useQuery();
  const userId = data?.id ?? "";

  const { mutate, isLoading } = api.user.post.useMutation({
    onSuccess: () => {
      setStep(STEPS.INFO);
      setTitle("");
      setBed("1");
      setRoomCount("1");
      setDescription("");
      setGuestCount("1");
      setImage([]);
      setPrice("0");
      setDiscount("0");
      setImagePromosi("");
      setFasilitas([]);
      void ctx.user.invalidate();
      toast.success("Rooms Created");
    },
  });

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (bed === "") {
      return setError("The minimum number of beds must be 1");
    }
    if (guestCount === "") {
      return setError("The minimum number of guests must be 1");
    }
    if (!roomCount) {
      return setError("The minimum number of rooms must be 1");
    }
    if (step === STEPS.DESCRIPTION && !title) {
      return setDescError("must be at least more than 2 letters");
    }
    if (step === STEPS.DESCRIPTION && !description) {
      return setDescError("must be at least more than 2 letters");
    }
    setStep((value) => value + 1);
  };

  const onSubmit = () => {
    if (step === STEPS.PRICE && discount <= "0" && discount >= "100") {
      return setError("Minimum discount 0 and maximum 100");
    }
    if (step === STEPS.PRICE && !price) {
      return setError("has no price");
    }
    if (step !== STEPS.PRICE) {
      return onNext();
    }
    mutate({
      title,
      roomCount: parseInt(roomCount, 10),
      guestCount: parseInt(guestCount, 10),
      imagePromosi,
      image,
      discount: parseInt(discount, 10),
      price: parseInt(price, 10),
      description,
      bed: parseInt(bed, 10),
      fasilitas,
      userId,
    });
  };

  const btn = (
    <DialogFooter className="flex gap-2">
      <Button className="w-full" onClick={onBack}>
        Back
      </Button>
      <Button className="w-full" onClick={onNext}>
        Next
      </Button>
    </DialogFooter>
  );

  let bodycontent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detail Rooms</DialogTitle>
        <DialogDescription>Added the details of this room</DialogDescription>
      </DialogHeader>
      <p className="text-destructive">{error}</p>
      <div className="mt-2 grid grid-cols-1 gap-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="Bed">Bed</Label>
          <Input
            type="number"
            placeholder="Bed"
            value={bed}
            onChange={(e) => setBed(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="guestCount">Guest Count</Label>
          <Input
            type="number"
            defaultValue={guestCount}
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="roomCount">Room Count</Label>
          <Input
            type="number"
            placeholder="Room Count"
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        {bed === "" && roomCount === "" && guestCount == "" ? (
          <Button className="w-full" disabled>
            Next
          </Button>
        ) : (
          <Button className="w-full" onClick={onNext}>
            Next
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );

  if (step === STEPS.IMAGES) {
    bodycontent = (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image rooms</DialogTitle>
          <DialogDescription>Show Image of this rooms</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          <ImageUpload value={image} onChange={(value) => setImage(value)} />
        </div>
        {btn}
      </DialogContent>
    );
  }

  if (step === STEPS.FASILITAS) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Facility</DialogTitle>
          <DialogDescription>
            Added the main facilities of this room
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <Facility value={fasilitas} onChange={(item) => setFasilitas(item)} />
        </div>
        {btn}
      </DialogContent>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Description</DialogTitle>
          <DialogDescription>Add Descripstion</DialogDescription>
        </DialogHeader>
        <p className="text-destructive">{descError}</p>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Title">Title</Label>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Description">Description</Label>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        {btn}
      </DialogContent>
    );
  }

  if (step === STEPS.DISCOUNT) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Image banner promosi</DialogTitle>
          <DialogDescription>Add image banner promosi</DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <ImagePromosiUpload
            value={imagePromosi}
            onChange={(value) => setImagePromosi(value)}
          />
        </div>
        {btn}
      </DialogContent>
    );
  }

  if (step === STEPS.PRICE) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Price & Discount</DialogTitle>
          <DialogDescription>
            add price and discount for this room
          </DialogDescription>
        </DialogHeader>
        <p className="text-destructive">{error}</p>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="discount">Discount</Label>
            <Input
              type="text"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Price">Price</Label>
            <Input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button className="w-full" onClick={onBack}>
            Back
          </Button>
          {isLoading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="w-full" onClick={onSubmit}>
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="mt-4">
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Rooms
        </Button>
      </DialogTrigger>
      {bodycontent}
    </Dialog>
  );
};

export default RentModal;
