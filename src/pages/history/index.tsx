import ListingCard from "@/components/listing/ListingCard";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data, isLoading } = api.user.getUser.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <EmptyState showReset />;
  }

  const complete = data.reservations.filter((i) => i.status == "completed");

  const ratting = data.reservations.filter((i) => i.status === "rattings");

  const success = data.reservations.filter((i) => i.status === "success");

  return (
    <>
      <Navbar />
      <div className="py-20">
        <Container>
          {complete.length > 0 || ratting.length > 0 || success.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
              {success.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing.listing}
                  reservation={listing}
                  pending
                />
              ))}
              {complete.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing.listing}
                  reservation={listing}
                  rating
                />
              ))}
              {ratting.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing.listing}
                  reservation={listing}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="You not have history"
              subtitle="Make history first"
              rentmodal
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default index;
