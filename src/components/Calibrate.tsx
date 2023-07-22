// import {
//   CalibrationMarker,
//   CalibrationState,
// } from "../reducers/calibrationReducer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Calibrate(props) {
  // const { state, onUpdateValue } = props;

  // const Input = (id: string, marker: CalibrationMarker) => (
  //   <label
  //     key={id}
  //     htmlFor={id}
  //     className="flex gap-2 pb-1 items-center"
  //   >
  //     {id.toUpperCase()}:
  //     <input
  //       id={id}
  //       type="text"
  //       className="w-full rounded p-1"
  //       value={marker.value}
  //       // onChange={(event) => onUpdateValue(event, id)}
  //     />
  //   </label>
  // );

  // return (
  //   <div className="bg-white flex-grow p-4 flex flex-col gap-2 text-sm">
  //     <h2 className="text-base font-bold">X-axis</h2>
  //     {Input("x1", state.x1)}
  //     {Input("x2", state.x2)}
  //     <h2 className="text-base font-bold">Y-axis</h2>
  //     {Input("y1", state.y1)}
  //     {Input("y2", state.y2)}
  //   </div>
  // );

  return (
    <form action="">
      <CardHeader className="pt-0">
        <CardTitle>Calibrate X-Axis</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>X1</Label>
            <Input type="number" />
          </div>
          <div className="flex items-center gap-2">
            <Label>X2</Label>
            <Input type="number" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate Y-Axis</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>Y1</Label>
            <Input type="number" />
          </div>
          <div className="flex items-center gap-2">
            <Label>Y2</Label>
            <Input type="number" />
          </div>
        </CardDescription>
      </CardHeader>
      <input type="submit" hidden />
    </form>
  );
}
