import React from "react";
import type { Calibrations } from "@/lib/interpolators/types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";

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
    <article className="grid gap-5 p-4">
      <h3 className="text-muted-foreground text-sm font-semibold uppercase">
        Calibrations
      </h3>
      <section className="grid gap-2">
        <h4 className="text-muted-foreground text-xs font-semibold uppercase">
          X-Axis
        </h4>

        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>X1</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            type="number"
            value={props.calibrations.x1.value}
            onChange={(e) => updateValue(e, "x1")}
            onFocus={(e) => e.target.select()}
          />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>X2</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            type="number"
            value={props.calibrations.x2.value}
            onChange={(e) => updateValue(e, "x2")}
            onFocus={(e) => e.target.select()}
          />
        </InputGroup>
      </section>
      <div className="grid gap-2">
        <h4 className="text-muted-foreground text-xs font-semibold uppercase">
          Y-Axis
        </h4>

        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Y1</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            type="number"
            value={props.calibrations.y1.value}
            onChange={(e) => updateValue(e, "y1")}
            onFocus={(e) => e.target.select()}
          />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Y2</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            type="number"
            value={props.calibrations.y2.value}
            onChange={(e) => updateValue(e, "y2")}
            onFocus={(e) => e.target.select()}
          />
        </InputGroup>
      </div>
    </article>
  );
}
