import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImagePromosiUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const ImagePromosiUpload: React.FC<ImagePromosiUploadProps> = ({
  value,
  onChange,
}) => {
  const [filevalue, setFilevalue] = useState(value);
  const handleUploadComplete = (
    res:
      | {
          fileUrl: string;
          fileKey: string;
        }[]
      | undefined
  ) => {
    if (res) {
      const fileUrl = res[0]?.fileUrl ?? "";
      setFilevalue(fileUrl);
      onChange(fileUrl);
    }
  };

  const handleUploadError = (error: Error) => {
    // Do something with the error.
    alert(`ERROR! ${error.message}`);
  };

  const handleRemove = useCallback(() => {
    onChange("");
    setFilevalue("");
  }, [onChange]);

  return (
    <>
      <main className="flex flex-col items-center justify-between p-24">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </main>
      <div className="relative grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto">
        {filevalue && (
          <div className="relative h-60 w-full">
            <Image
              fill
              style={{ objectFit: "cover" }}
              src={filevalue}
              alt="House"
            />
            <button
              aria-hidden="true"
              onClick={handleRemove}
              className="
                  absolute
                  right-2
                  top-2
                  rounded-full
                  bg-white
                  p-1
                  shadow
                  hover:bg-neutral-200
                  focus:outline-none
                "
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImagePromosiUpload;
