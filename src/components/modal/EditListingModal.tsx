/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react";
enum STEPS {
  CHOISE = 0,
  INFO = 1,
  IMAGES = 2,
  FASILITAS = 3,
  DISCOUNT = 4,
  DESCRIPTION = 5,
  IMAGEPROPMO = 6,
  PRICE = 7,
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
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Facility from "../shared/Facility";
import ImagePromosiUpload from "../shared/ImagePromosiUpload";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { type Image, type Listing, type Fasilitas } from "@prisma/client";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import Input from "../shared/Input";
import TextArea from "../shared/TextArea";
import EditUpload from "../shared/EditUpload";

interface EditListingModalProps {
  listingId: string;
  listings: Listing & {
    fasilitas: Fasilitas[];
    imageSrc: Image[];
  };
}

const EditListingModal: React.FC<EditListingModalProps> = ({
  listingId,
  listings,
}) => {
  const [step, setStep] = useState(STEPS.CHOISE);
  const [image, setImage] = useState<string[]>([]);
  const [fasilitas, setFasilitas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      img: listings.imageSrc,
      price: listings.price,
      bed: listings.bed,
      fasilitas: listings.fasilitas,
      title: listings.title,
      description: listings.description,
      roomCount: listings.roomCount,
      guestCount: listings.guestCount,
      discount: listings.discount,
      listingId: listings.id,
      imagepromo: listings.imagePromo,
    },
  });
  const ctx = api.useContext();
  const { data } = api.admin.getAdmin.useQuery();
  const userId = data?.id ?? "";

  const { mutate, isLoading } = api.listings.editListings.useMutation({
    onSuccess: () => {
      setStep(STEPS.CHOISE);
      void ctx.admin.invalidate();
      toast.success("Rooms updated");
    },
  });

  const onStepClick = (step: number) => {
    setStep(step);
  };

  const onBack = () => {
    setStep(STEPS.CHOISE);
  };

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    mutate({
      bed: parseInt(data.bed, 10),
      listingId,
      price: parseInt(data.price, 10),
      discount: parseInt(data.discount, 10),
      roomCount: parseInt(data.roomCount, 10),
      guestCount: parseInt(data.guestCount, 10),
      title: data.title,
      description: data.description,
      userId,
      imagePromosi: data.imagePromo,
    });
  };

  const { mutate: createImage } = api.listings.createImage.useMutation({
    onSuccess: () => {
      toast.success("Image updated");
      setStep(STEPS.CHOISE);
      void ctx.admin.invalidate();
    },
  });

  const submitImage = () => {
    createImage({
      listingId,
      image,
    });
  };

  const { mutate: createFasilitas } = api.listings.createFasilitas.useMutation({
    onSuccess: () => {
      toast.success("Fasilitas updated");
      setStep(STEPS.CHOISE);
      void ctx.admin.invalidate();
    },
  });

  const sumbmitFasilitas = () => {
    createFasilitas({
      listingId,
      fasi: fasilitas,
    });
  };

  const imagePromo = watch("imagePromo");

  let footer = (
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
        <Button className="w-full" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      )}
    </DialogFooter>
  );

  if (step === STEPS.IMAGES) {
    footer = (
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
          <Button className="w-full" onClick={submitImage}>
            Submit
          </Button>
        )}
      </DialogFooter>
    );
  }
  if (step === STEPS.FASILITAS) {
    footer = (
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
          <Button className="w-full" onClick={sumbmitFasilitas}>
            Submit
          </Button>
        )}
      </DialogFooter>
    );
  }

  let bodycontent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogTitle>Pilihan</DialogTitle>
      <DialogDescription>pilih mana yang mau di edit</DialogDescription>
      <div className="flex flex-col gap-4">
        <Button onClick={() => onStepClick(STEPS.INFO)} variant="outline">
          Edit Rooms, Bed, & Guest
        </Button>
        <Button onClick={() => onStepClick(STEPS.IMAGES)} variant="outline">
          Edit Image
        </Button>
        <Button onClick={() => onStepClick(STEPS.FASILITAS)} variant="outline">
          Edit Fasilitas
        </Button>
        <Button onClick={() => onStepClick(STEPS.DISCOUNT)} variant="outline">
          Edit Banner
        </Button>

        <Button onClick={() => onStepClick(STEPS.PRICE)} variant="outline">
          Edit Price & Discount
        </Button>
      </div>
      {footer}
    </DialogContent>
  );

  if (step === STEPS.INFO) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Rooms</DialogTitle>
          <DialogDescription>Added the details of this room</DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Bed">Bed</Label>
            <Input
              id="bed"
              label="Bed"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="guestCount">Guest Count</Label>
            <Input
              id="guestCount"
              label="Tamu"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="roomCount">Room Count</Label>
            <Input
              id="roomCount"
              label="Rooms"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
            />
          </div>
        </div>
        {footer}
      </DialogContent>
    );
  }

  if (step === STEPS.IMAGES) {
    bodycontent = (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image rooms</DialogTitle>
          <DialogDescription>Show Image of this rooms</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          <EditUpload
            value={image}
            onChange={(value) => setImage(value)}
            images={listings.imageSrc}
          />
        </div>
        {footer}
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
          <Facility
            value={fasilitas}
            onChange={(value) => setFasilitas(value)}
            fasilitas={listings.fasilitas}
          />
        </div>
        {footer}
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
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Title">Title</Label>
            <Input
              id="title"
              label="title"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Description">Description</Label>
            <TextArea
              id="description"
              disabled={isLoading}
              register={register}
              errors={errors}
              label="description"
            />
          </div>
        </div>
        {footer}
      </DialogContent>
    );
  }

  if (step === STEPS.DISCOUNT) {
    bodycontent = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Image banner promosi</DialogTitle>
          <DialogDescription>Add image banner promosi</DialogDescription>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <ImagePromosiUpload
              value={imagePromo}
              onChange={(value) => setCustomValue("imagePromo", value)}
            />
          </div>
        </DialogHeader>
        {footer}
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
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              label="Discount"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="Price">Price</Label>
            <Input
              id="price"
              label="Price"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
            />
          </div>
        </div>
        {footer}
      </DialogContent>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      {bodycontent}
    </Dialog>
  );
};

export default EditListingModal;
