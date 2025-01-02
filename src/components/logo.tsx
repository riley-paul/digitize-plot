import { Heading, Link, Text } from "@radix-ui/themes";
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <Heading size="5" className="flex items-center gap-3">
        <i className="fa-solid fa-chart-line text-accent-10" />
        Digitize Plot
      </Heading>
      <Text size="1" color="gray">
        An app by{" "}
        <Link href="https://rileypaul.ca" target="_blank">
          Riley Paul
        </Link>
      </Text>
    </div>
  );
};

export default Logo;
