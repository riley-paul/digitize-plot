import React from "react";
import type { Calibrations } from "@/lib/interpolators/types";
import { DataList, Heading, TextField } from "@radix-ui/themes";

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
    <section className="grid gap-5 p-4">
      <Heading as="h3" size="3">
        Calibrations
      </Heading>
      <div className="grid gap-2">
        <Heading as="h3" size="2" weight="medium">
          X-Axis
        </Heading>
        <DataList.Root className="pl-2">
          <DataList.Item align="center">
            <DataList.Label minWidth="1rem">X1</DataList.Label>
            <DataList.Value>
              <TextField.Root
                type="number"
                variant="soft"
                value={props.calibrations.x1.value}
                onChange={(e) => updateValue(e, "x1")}
                onFocus={(e) => e.target.select()}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label minWidth="1rem">X2</DataList.Label>
            <DataList.Value>
              <TextField.Root
                type="number"
                variant="soft"
                value={props.calibrations.x2.value}
                onChange={(e) => updateValue(e, "x2")}
                onFocus={(e) => e.target.select()}
              />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </div>
      <div className="grid gap-2">
        <Heading as="h3" size="2" weight="medium">
          Y-Axis
        </Heading>
        <DataList.Root className="pl-2">
          <DataList.Item align="center">
            <DataList.Label minWidth="1rem">Y1</DataList.Label>
            <DataList.Value>
              <TextField.Root
                type="number"
                variant="soft"
                value={props.calibrations.y1.value}
                onChange={(e) => updateValue(e, "y1")}
                onFocus={(e) => e.target.select()}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label minWidth="1rem">Y2</DataList.Label>
            <DataList.Value>
              <TextField.Root
                type="number"
                variant="soft"
                value={props.calibrations.y2.value}
                onChange={(e) => updateValue(e, "y2")}
                onFocus={(e) => e.target.select()}
              />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </div>
    </section>
  );
}
