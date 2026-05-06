import React from "react";
import XTermTerminal from "../../Component/Terminal";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  return <div></div>;
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
