import React from "react";
import { Switch, Text } from "@radix-ui/themes";

export type Props = {
  id: string;
  name: string;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Toggle(props: Props) {
  const flip = () => props.setState((prev) => !prev);

  return (
    <div className="flex items-center space-x-2 pt-0">
      <Switch id={props.id} checked={props.state} onCheckedChange={flip} />
      <Text size="2" weight="medium" htmlFor={props.id}>
        {props.name}
      </Text>
    </div>
  );
}
