import Navbar from "@/components/navbar/Navbar";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import Settings from "@/components/shared/Settings";
import { api } from "@/utils/api";

const index = () => {
  const { data, isLoading } = api.user.getUser.useQuery();

  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <EmptyState showReset />;
  }
  return (
    <>
      <Navbar />
      <Settings data={data} />
    </>
  );
};

export default index;
