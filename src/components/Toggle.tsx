import { Dispatch, SetStateAction } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export type Props = {
  id: string;
  name: string;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
};

export default function Toggle(props: Props) {
  const flip = () => props.setState((prev) => !prev);

  return (
    <div className="flex items-center space-x-2 p-6">
      <Switch id={props.id} checked={props.state} onCheckedChange={flip} />
      <Label htmlFor={props.id}>{props.name}</Label>
    </div>
  );
}
