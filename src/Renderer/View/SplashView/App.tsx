import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../style/index.css";
import "../../I18n";
import { SplashView } from "./SplashPage";

const STARTUP_MESSAGES = [
  "Checking launcher files...",
  "Preparing renderer...",
  "Opening launcher...",
];

const App: React.FC = () => {
  const [progress, setProgress] = useState(12);
  const messageIndex = Math.min(Math.floor(progress / 34), STARTUP_MESSAGES.length - 1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((currentProgress) => Math.min(currentProgress + 7, 100));
    }, 90);

    return () => window.clearInterval(timer);
  }, []);

  return <SplashView progress={progress} message={STARTUP_MESSAGES[messageIndex]} />;
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
