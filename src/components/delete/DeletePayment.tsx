import React from "react";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

type Props = {
  listingId: string;
  reservationsId: string;
  rooms: number;
  createdAt: Date;
};

const DeletePayment: React.FC<Props> = ({
  listingId,
  reservationsId,
  rooms,
  createdAt,
}) => {
  const ctx = api.useContext();

  const { mutate: delet, isLoading } = api.user.deleteReservasi.useMutation({
    onSuccess: () => {
      void ctx.user.invalidate();
      toast.success("Reservation deleted");
    },
  });

  const deleteReservasi = () => {
    delet({
      listingId: listingId,
      reservationsId: reservationsId,
      rooms,
    });
  };
  return (
    <Button
      disabled={isLoading}
      onClick={deleteReservasi}
      variant={"outline"}
      title="Delete Reservation"
      className="border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white"
    >
      <TrashIcon className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
};

export default DeletePayment;
