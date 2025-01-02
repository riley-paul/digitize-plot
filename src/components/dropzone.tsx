import React from "react";

import { Button, Card, Heading, Text, TextField } from "@radix-ui/themes";

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
      <Card className="max-w-lg" size="3">
        <div className="grid gap-5">
          <header>
            <Heading as="h2" size="4" mb="2">
              Welcome to Digitize Plot
            </Heading>
            <Text color="gray" size="2" mb="4" asChild>
              <p>
                A tool to quickly and painlessly convert images of plotted data
                into raw points.
              </p>
            </Text>
            <Text color="gray" size="2" mb="1" asChild>
              <p>
                To get started, choose an image of a plot to be digitized. Or if
                you just want to try out the app, start with a sample image.
              </p>
            </Text>
          </header>
          <form action="" className="grid gap-3" onSubmit={onSubmit}>
            <input
              type="file"
              accept="image/*"
              placeholder="Select plot image to digitized"
              onChange={onFileChange}
            />
            {error && (
              <Text color="red" size="1">
                {error}
              </Text>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full" type="submit" disabled={!file}>
                Let's go
              </Button>
              <Button variant="soft" className="w-full" onClick={useSample}>
                Use Sample Image
              </Button>
            </div>
            <input type="submit" hidden />
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Dropzone;
