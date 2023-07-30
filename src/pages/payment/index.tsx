import ListingPayment from "@/components/listing/ListingPayment";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import React from "react";

const IndexPayment = () => {
  const router = useRouter();
  const { data, isLoading } = api.user.getPending.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return router.push("/");
  }

  return (
    <>
      <Navbar />
      {data.length > 0 ? (
        <div className="pt-20">
          <Container>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
              {data.map((reserv) => (
                <ListingPayment
                  key={reserv.id}
                  listing={reserv.listing}
                  reservation={reserv}
                />
              ))}
            </div>
          </Container>
        </div>
      ) : (
        <EmptyState
          title="You have no payments"
          subtitle="choose a room first"
          rentmodal
        />
      )}
    </>
  );
};

export default IndexPayment;
