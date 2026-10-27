import { useState } from 'react';

export default function WaveSimulator() {
  const [freq, setFreq] = useState(2);
  const [amp, setAmp] = useState(30);

  const points = [];
  for (let x = 0; x <= 300; x += 2) {
    const y = 50 + Math.sin((x / 300) * Math.PI * 2 * freq) * amp;
    points.push(`${x},${y.toFixed(2)}`);
  }
  const pathData = `M ${points.join(' L ')}`;

  return (
    <div className="my-8 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
      <h4 className="text-sm font-bold mb-4 text-zinc-700 dark:text-zinc-300">交互片段：正弦波发生器</h4>

      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="w-24 shrink-0">频率：{freq}</span>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={freq}
            onChange={(event) => setFreq(parseFloat(event.target.value))}
            className="flex-1 accent-zinc-800 dark:accent-zinc-200"
          />
        </label>
        <label className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="w-24 shrink-0">振幅：{amp}px</span>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={amp}
            onChange={(event) => setAmp(parseInt(event.target.value, 10))}
            className="flex-1 accent-zinc-800 dark:accent-zinc-200"
          />
        </label>
      </div>

      <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 p-2">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 300 100"
          role="img"
          aria-label={`频率 ${freq}、振幅 ${amp} 像素的正弦波`}
          className="stroke-zinc-800 dark:stroke-zinc-200 fill-none stroke-2"
        >
          <line x1="0" y1="50" x2="300" y2="50" className="stroke-zinc-200 dark:stroke-zinc-800 stroke-1" />
          <path d={pathData} />
        </svg>
      </div>
    </div>
  );
}
