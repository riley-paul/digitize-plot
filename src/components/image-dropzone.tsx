import React, { useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { IconX } from "@tabler/icons-react";

import { monitorForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { containsFiles } from "@atlaskit/pragmatic-drag-and-drop/external/file";
import { cn } from "@/lib/utils";

type Props = {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
};

const ImageDropzone: React.FC<Props> = ({ file, setFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() =>
    monitorForExternal({
      canMonitor: containsFiles,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    }),
  );

  if (file) {
    const url = URL.createObjectURL(file);
    return (
      <div className="relative overflow-clip rounded-xl border">
        <img src={url} alt="Uploaded plot" className="h-full object-contain" />
        <Button
          className="group absolute top-4 right-4"
          size="icon-sm"
          variant="outline"
          onClick={() => setFile(undefined)}
        >
          <IconX className="group-hover:text-destructive" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "bg-secondary/30 flex h-24 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed transition-colors",
        isDragging && "border-primary bg-primary/10",
      )}
    >
      <input {...getInputProps()} />
      <span
        className={cn(
          "text-muted-foreground text-sm",
          isDragging && "text-foreground",
        )}
      >
        Drop image here
      </span>
    </div>
  );
};

export default ImageDropzone;
