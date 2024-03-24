import { LineChart } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="flex gap-3">
        <LineChart size={24} className="text-primary" />
        <span className="text-lg font-bold">Digitize Plot</span>
      </h1>
      <p className="text-xs text-gray-500">
        An app by{" "}
        <a
          href="https://rileypaul.ca"
          target="_blank"
          className="text-sky-500 hover:underline"
        >
          Riley Paul
        </a>
      </p>
    </div>
  );
};

export default Logo;
