// import {
//   CalibrationMarker,
//   CalibrationState,
// } from "../reducers/calibrationReducer";

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Calibrations } from "@/types/calibrations";

export type Props = {
  calibrations: Calibrations;
  setCalibrations: Dispatch<SetStateAction<Calibrations>>;
};

export default function Calibrate(props: Props) {
  const updateValue = (
    event: ChangeEvent<HTMLInputElement>,
    id: keyof Calibrations
  ) => {
    const actual = event.target.value;

    props.setCalibrations((prev) => {
      return {
        ...prev,
        [id]: { ...prev[id], actual },
      };
    });
  };

  return (
    <form action="">
      <CardHeader className="pt-0">
        <CardTitle>Calibrate X-Axis</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>X1</Label>
            <Input
              type="number"
              value={props.calibrations.x1.actual}
              onChange={(e) => updateValue(e, "x1")}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>X2</Label>
            <Input
              type="number"
              value={props.calibrations.x2.actual}
              onChange={(e) => updateValue(e, "x2")}
            />
          </div>
        </CardDescription>
      </CardHeader>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate Y-Axis</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>Y1</Label>
            <Input
              type="number"
              value={props.calibrations.y1.actual}
              onChange={(e) => updateValue(e, "y1")}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Y2</Label>
            <Input
              type="number"
              value={props.calibrations.y2.actual}
              onChange={(e) => updateValue(e, "y2")}
            />
          </div>
        </CardDescription>
      </CardHeader>
      <input type="submit" hidden />
    </form>
  );
}
