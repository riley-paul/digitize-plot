import React from "react";

import FilePicker from "./file-picker";
import { Button, Card, Heading, Text } from "@chakra-ui/react";

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
    <div>
      <Card.Root>
        <div>
          <Card.Header>
            <Heading as="h2">Welcome to Digitize Plot</Heading>
            <Text color="gray">
              A tool to quickly and painlessly convert images of plotted data
              into raw points.
            </Text>
            <Text color="gray">
              To get started, choose an image of a plot to be digitized. Or if
              you just want to try out the app, start with a sample image.
            </Text>
          </Card.Header>
          <form action="" className="grid gap-3" onSubmit={onSubmit}>
            <FilePicker selectedFile={file} setSelectedFile={setFile} />
            {error && <Text color="red">{error}</Text>}
            <Card.Footer>
              <Button variant="subtle" onClick={useSample}>
                Use Sample Image
              </Button>
              <Button type="submit" disabled={!file}>
                Let's go
                <i className="fa-solid fa-arrow-right"></i>
              </Button>
            </Card.Footer>
            <input type="submit" hidden />
          </form>
        </div>
      </Card.Root>
    </div>
  );
};

export default Dropzone;
