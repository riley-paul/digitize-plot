import React from "react";
import { Toggle } from "../ui/toggle";
import { IconQuestionMark } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { showHelpAtom } from "@/lib/store";

const HelpToggle: React.FC = () => {
  const [showHelp, setShowHelp] = useAtom(showHelpAtom);

  return (
    <Toggle
      className="rounded-full"
      variant="outline"
      pressed={showHelp}
      onPressedChange={setShowHelp}
      aria-label="Toggle Help"
    >
      <IconQuestionMark />
    </Toggle>
  );
};

export default HelpToggle;
