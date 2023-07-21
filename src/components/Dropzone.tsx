import React, { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ImageType from "../types/Image";

export default function Dropzone({
  setImage,
}: {
  setImage: Dispatch<ImageType>;
}) {
  const useSample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = "/BPL220K 24ft.png";
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImage({
        height: img.height,
        width: img.width,
        src: url,
      });
    };
    img.onerror = (err) => {
      console.log("img error");
      console.error(err);
    };
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const img = new Image();
      const url = URL.createObjectURL(acceptedFiles[0]);

      img.src = url;
      img.onload = () => {
        setImage({
          height: img.height,
          width: img.width,
          src: url,
        });
      };
      img.onerror = (err) => {
        console.log("img error");
        console.error(err);
      };
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  return (
    <div
      className="border-2 bg-white w-4/5 h-4/5 flex justify-center items-center"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          Drop image here
          <div>or</div>
          <button
            className="py-1 px-2 border-2 flex items-center justify-center"
            onClick={useSample}
          >
            Use Sample Image
          </button>
        </div>
      )}
    </div>
  );
}
