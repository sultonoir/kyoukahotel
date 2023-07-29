import React from "react";
import AdminReserv from "../admin/AdminReserv";
import { api } from "@/utils/api";
import EmptyState from "../shared/EmptyState";
import ListingCard from "../listing/ListingCard";
import Heading from "../shared/Heading";
import Loader from "../shared/Loader";

const RoomsAdmin = () => {
  const { data, isLoading } = api.admin.getAllRooms.useQuery();

  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <EmptyState />;
  }
  return (
    <>
      <div className="flex justify-between">
        <Heading title="Rooms Available" />
        <AdminReserv />
      </div>
      <div className="my-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
        {data.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
};

export default RoomsAdmin;
