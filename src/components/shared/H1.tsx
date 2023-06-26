import React from "react";
import { play } from "../types";

interface H1props {
  children: React.ReactNode;
}

const H1: React.FC<H1props> = ({ children }) => {
  return (
    <h1
      className={`${play.className} mb-5 text-center text-5xl font-bold capitalize`}
    >
      {children}
    </h1>
  );
};

export default H1;
