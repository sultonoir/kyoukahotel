"use client";
import Navbar from "@/components/navbar/Navbar";
import { shootFireworks } from "@/lib/succes";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SuccessClient = () => {
  React.useEffect(() => {
    shootFireworks();
  }, []);

  const router = useRouter();

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

            <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
            <p className="text-center text-gray-600">
              Thank you for your payment. Your transaction has been successfully
              processed.
            </p>
            <p className="text-center text-primary">
              Generate invoice for Checkin
            </p>
            <div>
              <button
                onClick={() => router.push("/")}
                className="mr-2 mt-4 rounded-md bg-rose-500 px-4 py-2 font-bold text-white hover:bg-rose-600 focus:outline-none"
              >
                Back to home
              </button>
              <Link
                className="mt-4 rounded-md border border-rose-500 px-4 py-2 text-rose-500"
                href="/history"
              >
                Invoice
              </Link>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default SuccessClient;
