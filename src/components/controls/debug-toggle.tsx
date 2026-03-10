import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useAtom } from "jotai";
import { debugAtom } from "@/lib/store";

const DebugToggle: React.FC = () => {
  const [debug, setDebug] = useAtom(debugAtom);

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={debug} onCheckedChange={setDebug} id="debug-mode" />
      <Label htmlFor="debug-mode">Debug Mode</Label>
    </div>
  );
};

export default DebugToggle;
