import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUpload {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function ImageUpload({ value, onChange }: ImageUpload) {
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
      <main className="flex flex-col items-center justify-between p-24">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </main>
      <div className="relative grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto xl:grid-cols-2">
        {filevalue.map((file) => (
          <div key={file} className="relative h-[200px]">
            <Image
              src={file}
              alt={file}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              quality={100}
            />
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
