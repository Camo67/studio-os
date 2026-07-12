'use client';

import React, { useState, useEffect } from 'react';

export default function StudioClockPage() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [rate] = useState(150);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cost = (seconds / 3600) * rate;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white">
      <div className="text-9xl font-mono font-bold tracking-widest mb-8">
        {formatTime(seconds)}
      </div>
      
      <div className="text-6xl font-light text-accent mb-12">
        ${cost.toFixed(2)}
      </div>

      <div className="text-xl text-gray-400 mb-12">
        Rate: ${rate}.00/hr
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
          className={`px-8 py-4 rounded-lg text-2xl font-bold transition-colors ${
            isRunning ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-danger hover:bg-red-500 text-white'
          }`}
        >
          START
        </button>
        
        <button
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          className={`px-8 py-4 rounded-lg text-2xl font-bold transition-colors ${
            !isRunning ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark text-black'
          }`}
        >
          STOP
        </button>

        <button
          onClick={() => { setIsRunning(false); setSeconds(0); }}
          className="px-8 py-4 rounded-lg text-2xl font-bold bg-gray-700 hover:bg-gray-600 text-white"
        >
          RESET
        </button>
      </div>
    </div>
  );
}