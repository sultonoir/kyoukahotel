"use client";
import Navbar from "@/components/navbar/Navbar";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { api } from "@/utils/api";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SuccessClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderID = params?.get("order_id");
  const transaction_status = params?.get("transaction_status");
  const { data, isLoading } = api.user.getUser.useQuery();
  const { mutate } = api.user.getInvoice.useMutation({});
  useEffect(() => {
    mutate({
      reservationsId: orderID ?? "",
    });
  }, [mutate, orderID]);

  if (isLoading) {
    return <Loader />;
  }
  if (!data) {
    return <EmptyState />;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-20">
        <Transition
          show={true}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex flex-col items-center">
            <span className="relative w-[150px]">
              <Image
                width={150}
                height={150}
                src="/success.svg"
                alt="success"
              />
            </span>

            <h1 className="mb-2 text-2xl font-bold">
              {data.name} Payment Successful!
            </h1>
            <p className="text-center text-gray-600">
              Thank you for your payment. Your transaction has been successfully
              processed.
            </p>
            <p className="text-center text-primary">
              <strong>use {data.email} for Check-In</strong>
            </p>
            <div>
              <button
                onClick={() => router.push("/")}
                className="mr-2 mt-4 rounded-md bg-rose-500 px-4 py-2 font-bold text-white hover:bg-rose-600 focus:outline-none"
              >
                Back to home
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default SuccessClient;
