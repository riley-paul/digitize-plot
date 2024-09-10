import React from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

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
      <Label htmlFor={props.id}>{props.name}</Label>
    </div>
  );
}
