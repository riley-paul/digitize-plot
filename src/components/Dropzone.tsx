import React, { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

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


  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Digitize Plot</CardTitle>
          <CardDescription>
            A tool to quickly and painlessly convert images of plotted data into
            raw points.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-col">
          <CardDescription>
            To get started, choose an image of a plot to be digitized. Or if you
            just want to try out the app, start with a sample image.
          </CardDescription>
          <form action="" className="mt-2 grid gap-2">
            <Input
              type="file"
              accept="image/*"
              placeholder="Select plot image to digitized"
            />
            <div className="flex gap-2">
              <Button className="w-full">Let's go</Button>
              <Button variant="secondary" className="w-full">Use Sample Image</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
