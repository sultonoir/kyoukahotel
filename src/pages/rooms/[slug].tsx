import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Container from "@/components/shared/Container";
import Navbar from "@/components/navbar/Navbar";
import ListingHead from "@/components/listing/ListingHead";
import ListingInfo from "@/components/listing/ListingInfo";
import ListingReservation from "@/components/listing/ListingReservation";

const RoomPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);
  const listingId = Array.isArray(slug) ? slug[0] : slug;
  const { data: listing } = api.listings.getListingById.useQuery({
    listingId: listingId ?? "",
  });

  if (!listing) {
    return <p>404</p>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <Container>
          <div className=" mx-auto max-w-screen-lg">
            <div className="flex flex-col gap-6">
              <ListingHead title={listing.title} imageSrc={listing.imageSrc} />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-7 md:gap-10">
                <ListingInfo
                  description={listing.description}
                  roomCount={listing.roomCount}
                  guestCount={listing.guestCount}
                  fasilitas={listing.fasilitas}
                  title={listing.title}
                  bed={listing.bed}
                />
                <div className="order-first mb-10 md:order-last md:col-span-3">
                  <ListingReservation
                    price={listing.price}
                    discount={listing.discount}
                    listingId={listingId ?? ""}
                    rooms={listing.roomCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default RoomPage;
