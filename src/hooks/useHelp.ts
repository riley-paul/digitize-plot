import { useState } from "react";
import { useCookies } from "react-cookie";

export default function useHelp() {
  const [cookies, setCookie] = useCookies(["show-help"]);
  console.log(cookies)
  const [showHelp, setShowHelp] = useState(cookies["show-help"] !== "false");

  const handleSetShowHelp = (state: boolean) => {
    setShowHelp(state);
    setCookie("show-help", state);
  };

  return { showHelp, handleSetShowHelp };
}
