"use client";
import React from "react";

interface containerprops {
  children: React.ReactNode;
}

const Container = ({ children }: containerprops) => {
  return (
    <div className="container mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      {children}
    </div>
  );
};

export default Container;
