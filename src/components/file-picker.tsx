import { Button, Strong, Text } from "@radix-ui/themes";
import React from "react";

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
        size="3"
        type="button"
        onClick={handleFileClick}
        className="bg-blue-500 text-white rounded shadow hover:bg-blue-600 px-4 py-2"
      >
        <i className="fa-solid fa-file"></i>
        {selectedFile ? "Change Image" : "Upload Image"}
      </Button>
      <input
        ref={ref}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
      {selectedFile && (
        <Text color="gray" size="1">
          Selected file: <Strong>{selectedFile.name}</Strong>
        </Text>
      )}
    </div>
  );
};

export default FilePicker;
