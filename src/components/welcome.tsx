import React from "react";

import FilePicker from "./file-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import ImageDropzone from "./image-dropzone";

export type Props = {
  onImageLoad: (image: HTMLImageElement) => void;
};

const Welcome: React.FC<Props> = ({ onImageLoad }) => {
  const [file, setFile] = React.useState<File | undefined>();

  const createImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => onImageLoad(img);
    img.onerror = (err) => {
      console.log("Could not load image");
      console.error(err);
    };
  };

  const useSample: React.MouseEventHandler = (_) => {
    // const url = `BPL220K 24ft.png`;
    const url = "beam-in-tension.png";
    createImage(url);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Digitize Plot</CardTitle>

          <CardDescription>
            A tool to quickly and painlessly convert images of plotted data into
            raw points.
          </CardDescription>

          <CardDescription>
            To get started, choose an image of a plot to be digitized. Or if you
            just want to try out the app, start with a sample image.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ImageDropzone file={file} setFile={setFile} />
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-3 border-t">
          <Button onClick={useSample}>Use sample image</Button>
          <Button
            onClick={() => {
              if (!file) return;
              const url = URL.createObjectURL(file);
              createImage(url);
            }}
            disabled={!file}
          >
            Let's go
            <IconArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
