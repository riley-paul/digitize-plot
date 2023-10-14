import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type Props = {
  setImage: Dispatch<HTMLImageElement | undefined>;
};

export default function Dropzone({ setImage }: Props) {
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const createImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => setImage(img);
    img.onerror = (err) => {
      console.log("Could not load image");
      console.error(err);
    };
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) {
      setFile(null);
      return;
    }
    setFile(event.target.files[0]);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!file) {
      setError("Must select an image file");
      return;
    }

    setError("");
    const url = URL.createObjectURL(file);
    createImage(url);
  };

  const useSample: MouseEventHandler = (_) => {
    const url = `BPL220K 24ft.png`;
    createImage(url);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
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
          <form action="" className="mt-2 grid gap-2" onSubmit={onSubmit}>
            <Input
              type="file"
              accept="image/*"
              placeholder="Select plot image to digitized"
              onChange={onFileChange}
            />
            {error && <small className="text-destructive">{error}</small>}
            <div className="flex flex-col lg:flex-row gap-2">
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
        <CardFooter>
          <small className="text-muted-foreground">
            An app by{" "}
            <a
              href="https://rileypaul.ca"
              className="underline hover:no-underline hover:text-foreground"
              target="blank"
            >
              Riley Paul
            </a>
          </small>
        </CardFooter>
      </Card>
    </div>
  );
}
