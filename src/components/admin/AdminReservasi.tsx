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
import { api } from "@/utils/api";
import { Button } from "../ui/button";
import { Loader2, ScrollTextIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { type Listing } from "@prisma/client";
import CategoryInput from "../shared/CategoryInput";
import AdminDateReservations from "./AdminDateReservations";

enum STEPS {
  REGISTER = 0,
  LISTING = 1,
  RESERVATIONS = 2,
}

interface AdminReservasiProps {
  listing: Listing[];
}

const AdminReservasi: React.FC<AdminReservasiProps> = ({ listing }) => {
  const [step, setStep] = useState(STEPS.REGISTER);
  const [list] = listing?.map((lis) => ({
    ...lis,
  }));
  const [listings, setListings] = useState(list);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const { mutate: createUsers, isLoading } = api.user.createUser.useMutation({
    onSuccess: () => {
      setStep(STEPS.LISTING);
    },
  });

  const createdUser = () => {
    createUsers({
      email,
      password: email,
      name,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  let body = (
    <>
      <div className="mt-2 grid grid-cols-1 gap-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="Name">Name</Label>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="Email">Email</Label>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="UserId">No.HP</Label>
          <Input
            placeholder="NO.HP"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          className="w-full bg-rose-600 text-secondary hover:bg-rose-500"
          onClick={createdUser}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>Next</>
          )}
        </Button>
      </DialogFooter>
    </>
  );

  if (step === STEPS.LISTING) {
    body = (
      <>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {listing.map((list) => (
            <div key={list.id} className="col-span-1">
              <CategoryInput
                label={list.title}
                onClick={(e) => setListings(e)}
                selected={listings?.id === list.id}
                item={list}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="mr-2 w-full border border-rose-500 font-semibold text-rose-500"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="w-full bg-rose-600 text-secondary hover:bg-rose-500"
            onClick={() => setStep(STEPS.RESERVATIONS)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Next</>
            )}
          </Button>
        </DialogFooter>
      </>
    );
  }

  if (step === STEPS.RESERVATIONS) {
    body = (
      <AdminDateReservations
        price={listings?.price ?? 0}
        listingId={listings?.title ?? ""}
        discount={listings?.discount ?? 0}
        rooms={listings?.roomCount ?? 0}
        name={name}
        email={email}
        guestId={userId}
        onBack={onBack}
      />
    );
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-rose-600 text-white hover:bg-rose-500">
          <ScrollTextIcon className="mr-2" />
          Create Reservations
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reservastions</DialogTitle>
          <DialogDescription>Create reservation</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
};

export default AdminReservasi;
