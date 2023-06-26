import { UploadButton } from "@/utils/uploadthing";
import { type Image } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import BluredImage from "./BluredImage";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ImageUpload {
  value: string[];
  onChange: (value: string[]) => void;
  images: Image[];
}

export default function ImageUpload({ value, onChange, images }: ImageUpload) {
  const router = useRouter();
  const [filevalue, setFilevalue] = useState(value);
  const { mutate } = api.listings.deleteImageByListing.useMutation({
    onSuccess: () => {
      toast.success("Image deleted");
      router.refresh();
    },
  });
  const handleUploadComplete = (
    res:
      | {
          fileUrl: string;
          fileKey: string;
        }[]
      | undefined
  ) => {
    if (res) {
      const fileUrls = res.map((item) => item.fileUrl);
      setFilevalue((prevFilevalue) => [...prevFilevalue, ...fileUrls]);
      onChange([...filevalue, ...fileUrls]);
    }
  };
  const handleUploadError = (error: Error) => {
    // Do something with the error.
    alert(`ERROR! ${error.message}`);
  };

  const handleRemove = useCallback(
    (file: string) => {
      const filteredFiles = filevalue.filter((item) => item !== file);
      setFilevalue(filteredFiles);
      onChange(filteredFiles);
    },
    [filevalue, onChange]
  );

  return (
    <>
      <main className="flex flex-col items-center justify-between p-2">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </main>
      <div className="relative grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto xl:grid-cols-2">
        {images.map((file) => {
          const deleteImages = () => {
            mutate({
              listingId: file.listingId,
              id: file.id,
            });
          };
          return (
            <div key={file.id} className="relative h-[200px]">
              <BluredImage src={file.img} alt={file.id} />
              <button
                aria-hidden="true"
                onClick={deleteImages}
                className="z-30b absolute right-2 top-2 rounded-full bg-white p-1 shadow hover:bg-neutral-200 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
          );
        })}
        {filevalue.map((file) => (
          <div key={file} className="relative h-[200px]">
            <BluredImage src={file} alt={file} />
            <button
              aria-hidden="true"
              onClick={() => handleRemove(file)}
              className="z-30b absolute right-2 top-2 rounded-full bg-white p-1 shadow hover:bg-neutral-200 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
