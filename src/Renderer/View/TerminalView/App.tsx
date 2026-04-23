import React from 'react';
import XTermTerminal from '../../Component/Terminal';
import { createRoot } from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen p-6 bg-gray-900 text-white select-none">
      <XTermTerminal></XTermTerminal>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);