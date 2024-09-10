import React from "react";
import { useCookies } from "react-cookie";

export default function useHelp() {
  const [cookies, setCookie] = useCookies(["show-help"]);
  const [showHelp, setShowHelp] = React.useState(
    cookies["show-help"] !== "false",
  );

  const handleSetShowHelp = (state: boolean) => {
    setShowHelp(state);
    setCookie("show-help", state);
  };

  return { showHelp, handleSetShowHelp };
}
