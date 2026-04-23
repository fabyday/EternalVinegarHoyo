import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import "../../style/index.css";

const App = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-900 text-white select-none">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-blue-400">MachiUI Framework</h1>
                <div className="text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    v1.0.0-dev
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 grid grid-cols-2 gap-4">
                <section className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                    <h2 className="text-lg font-semibold mb-4">Core Stats</h2>
                    <div className="space-y-3">
                        <p className="text-gray-400">Engine Status: <span className="text-green-400">Running</span></p>
                        <p className="text-gray-400">Renderer: <span className="text-blue-300">DirectX 12 / Metal</span></p>
                    </div>
                </section>

                <section className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-400 mb-2">Counter Test</p>
                    <div className="text-4xl font-mono font-bold mb-4">{count}</div>
                    <button
                        onClick={() => setCount(prev => prev + 1)}
                        className="btn-primary w-full"
                    >
                        Increment
                    </button>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-8 text-xs text-gray-500 text-center">
                &copy; 2026 MachiUI Project - Graphics & 3D Vision Researcher
            </footer>
        </div>
    );
};
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);