import AdminNavbar from "@/components/admin/AdminNavbar";
import Navbar from "@/components/navbar/Navbar";
import EmptyState from "@/components/shared/EmptyState";
import Settings from "@/components/shared/Settings";
import { api } from "@/utils/api";

const index = () => {
  const { data } = api.user.getUser.useQuery();

  if (!data) {
    return <EmptyState />;
  }
  return (
    <>
      {data.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <Settings data={data} />
    </>
  );
};

export default index;
