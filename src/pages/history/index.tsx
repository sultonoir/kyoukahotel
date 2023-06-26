import ListingCard from "@/components/listing/ListingCard";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data } = api.user.getUser.useQuery();

  if (!data) {
    return null;
  }
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Container>
          {data.reservations.length === 0 && (
            <EmptyState
              title="You not have reservations"
              subtitle="Make reservations first"
              rentmodal
            />
          )}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
            {data &&
              data.reservations
                .filter((res) => res.status === "pending")
                .map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing.listing}
                    reservation={listing}
                    pending
                  />
                ))}
            {data &&
              data.reservations
                .filter((res) => res.status === "success")
                .map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing.listing}
                    reservation={listing}
                    completed
                  />
                ))}
            {data &&
              data.reservations
                .filter((res) => res.status === "completed")
                .map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing.listing}
                    reservation={listing}
                    rating
                  />
                ))}
            {data &&
              data.reservations
                .filter((res) => res.status === "rattings")
                .map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing.listing}
                    reservation={listing}
                    completed
                  />
                ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default index;
