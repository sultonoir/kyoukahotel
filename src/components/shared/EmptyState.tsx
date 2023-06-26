"use client";
import { useRouter } from "next/navigation";
import Heading from "./Heading";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  rentmodal?: boolean;
};

const EmptyState = ({
  title = "404",
  subtitle = "Not Found",
  showReset,
  rentmodal,
}: Props) => {
  const router = useRouter();

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <Heading center title={title} subtitle={subtitle} />
      <div className="mt-4 w-48">
        {showReset && (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push("/")}
          >
            back to main page
          </Button>
        )}
        {rentmodal && (
          <Button
            className="w-full hover:bg-rose-600 hover:text-white"
            variant="outline"
            onClick={() => router.push("/rooms")}
          >
            Rooms
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
