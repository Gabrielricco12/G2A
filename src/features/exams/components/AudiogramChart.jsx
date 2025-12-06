import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registro do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FREQUENCIAS = ['125', '250', '500', '750', '1k', '2k', '3k', '4k', '6k', '8k'];

// --- Helpers de Símbolos ---
const createSymbol = (color, type) => {
  const img = new Image();
  const svgString = type === 'right_bone' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l-8-6 8-6"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18l8-6-8-6"/></svg>`;
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  return img;
};

const iconBoneRight = createSymbol('rgb(239, 68, 68)', 'right_bone'); 
const iconBoneLeft = createSymbol('rgb(59, 130, 246)', 'left_bone');

export function AudiogramChart({ 
  aereaDireita, 
  osseaDireita, 
  aereaEsquerda, 
  osseaEsquerda 
}) {
  
  const data = useMemo(() => ({
    labels: FREQUENCIAS,
    datasets: [
      // OD (Vermelho)
      {
        label: 'OD Aérea (O)',
        data: aereaDireita.map(v => (v === '' || v === '-') ? null : Number(v)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        pointStyle: 'circle',
        pointRadius: 6,
        borderWidth: 2,
        spanGaps: true,
        order: 2 
      },
      {
        label: 'OD Óssea (<)',
        data: osseaDireita.map(v => (v === '' || v === '-') ? null : Number(v)),
        borderColor: 'rgb(239, 68, 68)',
        pointStyle: iconBoneRight,
        pointRadius: 8, 
        showLine: false, 
        order: 1 // Z-index maior
      },
      // OE (Azul)
      {
        label: 'OE Aérea (X)',
        data: aereaEsquerda.map(v => (v === '' || v === '-') ? null : Number(v)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        borderDash: [6, 4],
        pointStyle: 'crossRot',
        pointRadius: 10,
        pointBorderWidth: 2,
        borderWidth: 2,
        spanGaps: true,
        order: 2
      },
      {
        label: 'OE Óssea (>)',
        data: osseaEsquerda.map(v => (v === '' || v === '-') ? null : Number(v)),
        borderColor: 'rgb(59, 130, 246)',
        pointStyle: iconBoneLeft,
        pointRadius: 8,
        showLine: false,
        order: 1 // Z-index maior
      }
    ],
  }), [aereaDireita, osseaDireita, aereaEsquerda, osseaEsquerda]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        reverse: true,
        min: -10,
        max: 120,
        ticks: { stepSize: 10 },
        title: { display: true, text: 'Nível de Audição (dB HL)', font: { weight: 'bold' } },
        grid: { color: '#e5e7eb' }
      },
      x: {
        position: 'top',
        title: { display: true, text: 'Frequência (Hz)' },
        grid: { color: '#e5e7eb' }
      },
    },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true } },
      tooltip: { 
        callbacks: { 
          label: (c) => `${c.dataset.label}: ${c.raw} dB` 
        } 
      }
    },
  };

  return (
    <div className="w-full h-full relative">
      <Line data={data} options={options} />
    </div>
  );
}