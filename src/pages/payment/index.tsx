import ListingPayment from "@/components/listing/ListingPayment";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data, isLoading } = api.user.getUser.useQuery();

  if (!data) {
    return <EmptyState />;
  }

  const pending = data.reservations.filter((res) => res.status === "pending");

  if (isLoading) {
    return <Loader />;
  }

  if (pending.length === 0) {
    return (
      <EmptyState
        title="You have no payment"
        subtitle="Back to home"
        showReset
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Container>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
            {data &&
              data.reservations
                .filter((res) => res.status === "pending")
                .map((listing) => (
                  <ListingPayment
                    key={listing.id}
                    listing={listing.listing}
                    reservation={listing}
                  />
                ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default index;
