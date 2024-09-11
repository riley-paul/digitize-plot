import React from "react";
import { CardHeader, CardTitle } from "src/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Calibrations } from "@/hooks/use-canvas-calibrators";

export type Props = {
  calibrations: Calibrations;
  setCalibrations: React.Dispatch<React.SetStateAction<Calibrations>>;
};

export default function Calibrate(props: Props) {
  const updateValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: keyof Calibrations,
  ) => {
    const value = Number(event.target.value);

    props.setCalibrations((prev) => ({
      ...prev,
      [id]: prev[id].copyWithValue(value),
    }));
  };

  return (
    <section>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate X-Axis</CardTitle>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Label>X1</Label>
            <Input
              type="number"
              value={props.calibrations.x1.value}
              onChange={(e) => updateValue(e, "x1")}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>X2</Label>
            <Input
              type="number"
              value={props.calibrations.x2.value}
              onChange={(e) => updateValue(e, "x2")}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </CardHeader>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate Y-Axis</CardTitle>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Label>Y1</Label>
            <Input
              type="number"
              value={props.calibrations.y1.value}
              onChange={(e) => updateValue(e, "y1")}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Y2</Label>
            <Input
              type="number"
              value={props.calibrations.y2.value}
              onChange={(e) => updateValue(e, "y2")}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </CardHeader>
    </section>
  );
}
