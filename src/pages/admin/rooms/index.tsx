import AdminNavbar from "@/components/admin/AdminNavbar";
import ListingCard from "@/components/listing/ListingCard";
import RentModal from "@/components/modal/RentModal";
import Container from "@/components/shared/Container";
import EmptyState from "@/components/shared/EmptyState";
import { api } from "@/utils/api";
import React from "react";

const index = () => {
  const { data: user } = api.user.getUser.useQuery();
  if (!user || user.role !== "admin") {
    return (
      <EmptyState
        title="You are not have access"
        subtitle="is'n admin"
        showReset
      />
    );
  }
  return (
    <div>
      <AdminNavbar />
      <Container>
        <RentModal />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-8">
          {user &&
            user.listing.map((listing) => (
              <ListingCard key={listing.id} listing={listing} admin />
            ))}
        </div>
      </Container>
    </div>
  );
};

export default index;
