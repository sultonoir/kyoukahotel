import Container from "@/components/shared/Container";
import { type Rating } from "@prisma/client";
import React from "react";
import { DataTable } from "./data-table";
import { columnRating } from "./columnRating";
import AdminNavbar from "@/components/admin/AdminNavbar";

type Props = {
  rattings: Rating[];
};

const RattingsClient: React.FC<Props> = ({ rattings }) => {
  return (
    <>
      <AdminNavbar />
      <div className="pt-20">
        <Container>
          <DataTable data={rattings} columns={columnRating} />
        </Container>
      </div>
    </>
  );
};

export default RattingsClient;
