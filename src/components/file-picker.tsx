import React from "react";
import { Button } from "./ui/button";

type Props = {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
};

const FilePicker: React.FC<Props> = (props) => {
  const { selectedFile, setSelectedFile } = props;
  const ref = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileClick = () => {
    ref.current?.click();
  };

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        onClick={handleFileClick}
      >
        <i className="fa-solid fa-file"></i>
        {selectedFile ? "Change Image" : "Upload Image"}
      </Button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {selectedFile && (
        <span >
          Selected file: <span className="font-bold">{selectedFile.name}</span>
        </span>
      )}
    </div>
  );
};

export default FilePicker;
