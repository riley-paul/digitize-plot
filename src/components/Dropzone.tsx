import React, { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export type Props = {
  setImage: Dispatch<HTMLImageElement | undefined>;
};

export default function Dropzone({ setImage }: Props) {
  const createImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => setImage(img);
    img.onerror = (err) => {
      console.log("Could not load image");
      console.error(err);
    };
  };

  const useSample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = "/BPL220K 24ft.png";
    createImage(url);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const url = URL.createObjectURL(acceptedFiles[0]);
      createImage(url);
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl">Digitize Plot</h1>
      <p>A tool </p>
      <div className="bg-white border-2 w-4/5 h-4/5 flex items-center justify-center" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            Drop image here
            <div className="text-sm font-bold">or</div>
            <button
              className="py-1 px-2 border-2 flex items-center justify-center"
              onClick={useSample}
            >
              Use Sample Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
