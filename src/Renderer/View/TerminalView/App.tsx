import React from "react";
import XTermTerminal from "../../Component/Terminal";
import { createRoot } from "react-dom/client";
import "../../style/index.css";
import "../../I18n";

const App: React.FC = () => {
  return (
    <div className="flex h-dvh min-h-[600px] flex-col bg-[#0b1020] p-6 text-white">
      <XTermTerminal height="100%" />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
