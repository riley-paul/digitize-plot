import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type Props = {
  onImageLoad: (image: HTMLImageElement) => void;
};

const Dropzone: React.FC<Props> = ({ onImageLoad }) => {
  const [error, setError] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const createImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => onImageLoad(img);
    img.onerror = (err) => {
      console.log("Could not load image");
      console.error(err);
    };
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) {
      setFile(null);
      return;
    }
    setFile(event.target.files[0]);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!file) {
      setError("Must select an image file");
      return;
    }

    setError("");
    const url = URL.createObjectURL(file);
    createImage(url);
  };

  const useSample: React.MouseEventHandler = (_) => {
    // const url = `BPL220K 24ft.png`;
    const url = "beam-in-tension.png";
    createImage(url);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Digitize Plot</CardTitle>
          <CardDescription>
            A tool to quickly and painlessly convert images of plotted data into
            raw points.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardDescription>
            To get started, choose an image of a plot to be digitized. Or if you
            just want to try out the app, start with a sample image.
          </CardDescription>
          <form action="" className="mt-2 grid gap-2" onSubmit={onSubmit}>
            <Input
              type="file"
              accept="image/*"
              placeholder="Select plot image to digitized"
              onChange={onFileChange}
            />
            {error && <small className="text-destructive">{error}</small>}
            <div className="flex flex-col gap-2 lg:flex-row">
              <Button className="w-full" type="submit" disabled={!file}>
                Let's go
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={useSample}
              >
                Use Sample Image
              </Button>
            </div>
            <input type="submit" hidden />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dropzone;
