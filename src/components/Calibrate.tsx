import React from "react";
import {
  CalibrationMarker,
  CalibrationState,
} from "../reducers/calibrationReducer";

export default function Calibrate(props: {
  state: CalibrationState;
  onUpdateValue: any;
}) {
  const { state, onUpdateValue } = props;

  const Input = (id: string, marker: CalibrationMarker) => (
    <label
      key={id}
      htmlFor={id}
      className="flex gap-2 pb-1 items-center"
    >
      {id.toUpperCase()}:
      <input
        id={id}
        type="text"
        className="w-full rounded p-1"
        value={marker.value}
        onChange={(event) => onUpdateValue(event, id)}
      />
    </label>
  );

  return (
    <div className="bg-white flex-grow p-4 flex flex-col gap-2 text-sm">
      <h2 className="text-base font-bold">X-axis</h2>
      {Input("x1", state.x1)}
      {Input("x2", state.x2)}
      <h2 className="text-base font-bold">Y-axis</h2>
      {Input("y1", state.y1)}
      {Input("y2", state.y2)}
    </div>
  );
}
