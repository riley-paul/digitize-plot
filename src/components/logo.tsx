import { IconChartCovariate } from "@tabler/icons-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground rounded-md p-1">
          <IconChartCovariate className="size-4" />
        </div>
        <span className="text-lg font-bold">Digitize Plot</span>
      </h1>
      <span className="text-muted-foreground text-xs">
        An app by{" "}
        <a
          className="hover:text-primary text-muted-foreground/80 underline-offset-2 hover:underline"
          href="https://rileypaul.ca"
          target="_blank"
        >
          Riley Paul
        </a>
      </span>
    </div>
  );
};

export default Logo;
