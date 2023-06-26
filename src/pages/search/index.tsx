import ListingCard from "@/components/listing/ListingCard";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/shared/Container";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data } = api.user.getListings.useQuery();
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Container>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
            {data &&
              data?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default index;
