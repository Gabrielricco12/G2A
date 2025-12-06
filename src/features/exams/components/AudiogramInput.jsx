import React, { useState } from 'react';
import { RefreshCw, Save, Activity } from 'lucide-react';
import { AudiogramChart } from './AudiogramChart';

const FREQUENCIAS = ['125', '250', '500', '1k', '2k', '3k', '4k', '6k', '8k'];
const FREQ_KEYS = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

export function AudiogramInput({ onSave, initialData }) {
  // --- ESTADOS ---
  // Inicializa com arrays vazios ou dados existentes se fornecidos
  const [dadosAereaDireita, setDadosAereaDireita] = useState(Array(9).fill(''));
  const [dadosOsseaDireita, setDadosOsseaDireita] = useState(Array(9).fill(''));
  const [dadosAereaEsquerda, setDadosAereaEsquerda] = useState(Array(9).fill(''));
  const [dadosOsseaEsquerda, setDadosOsseaEsquerda] = useState(Array(9).fill(''));

  // --- HANDLERS ---
  const handleInputChange = (index, value, setFunction, currentArray) => {
    // Permite vazio, sinal de menos ou números válidos entre -10 e 120
    if (value !== '' && value !== '-' && (isNaN(value) || value < -10 || value > 120)) return;
    
    const novosDados = [...currentArray];
    novosDados[index] = value;
    setFunction(novosDados);
  };

  const limparDados = () => {
    if (window.confirm("Deseja realmente limpar todos os dados do gráfico?")) {
      setDadosAereaDireita(Array(9).fill(''));
      setDadosOsseaDireita(Array(9).fill(''));
      setDadosAereaEsquerda(Array(9).fill(''));
      setDadosOsseaEsquerda(Array(9).fill(''));
    }
  };

  const handleSave = () => {
    // Helper para transformar array ['10', '', '20'] em objeto { 250: 10, 1000: 20 }
    const mapDataToFreqObj = (arr) => {
      const obj = {};
      arr.forEach((val, idx) => {
        if (val !== '' && val !== '-' && val !== null) {
          obj[FREQ_KEYS[idx]] = parseFloat(val);
        }
      });
      return obj;
    };

    const formattedData = {
      OD: {
        via_aerea: mapDataToFreqObj(dadosAereaDireita),
        via_ossea: mapDataToFreqObj(dadosOsseaDireita)
      },
      OE: {
        via_aerea: mapDataToFreqObj(dadosAereaEsquerda),
        via_ossea: mapDataToFreqObj(dadosOsseaEsquerda)
      }
    };
    
    if (onSave) onSave(formattedData);
  };

  return (
    <div className="space-y-6">
      
      {/* Header / Info */}
      <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">Lançamento Clínico</h3>
            <p className="text-xs text-slate-500">Insira os limiares. O gráfico é atualizado em tempo real.</p>
          </div>
        </div>
        <button 
          onClick={limparDados} 
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <RefreshCw size={14} /> Limpar
        </button>
      </div>

      {/* GRID PRINCIPAL (Inputs | Chart | Inputs) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-24">
        
        {/* COLUNA ESQUERDA: Orelha Direita (Inputs) */}
        <section className="xl:col-span-3 bg-white p-5 rounded-lg shadow-sm border-t-4 border-t-red-500">
          <h2 className="flex items-center gap-2 font-bold text-red-600 mb-6 pb-2 border-b border-slate-100">
            Orelha Direita (OD)
          </h2>
          
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-6">
            {/* Linha Aérea */}
            <div className="flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-400 rotate-180" style={{writingMode: 'vertical-rl'}}>AÉREA</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {FREQUENCIAS.map((freq, i) => (
                  <div key={`od-va-${i}`} className="text-center">
                    <label className="block text-[9px] text-slate-400 mb-1">{freq}</label>
                    <input 
                      className="w-full border border-slate-200 rounded p-1 text-center text-sm focus:border-red-500 focus:ring-1 focus:ring-red-200 outline-none transition-all font-mono"
                      value={dadosAereaDireita[i]}
                      placeholder="-"
                      onChange={(e) => handleInputChange(i, e.target.value, setDadosAereaDireita, dadosAereaDireita)}
                    />
                  </div>
               ))}
            </div>

            {/* Linha Óssea */}
            <div className="flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-400 rotate-180" style={{writingMode: 'vertical-rl'}}>ÓSSEA</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {FREQUENCIAS.map((freq, i) => (
                  <div key={`od-vo-${i}`} className="text-center">
                    <input 
                      className="w-full border border-slate-200 rounded p-1 text-center text-sm bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-200 outline-none transition-all placeholder-red-300 font-mono"
                      value={dadosOsseaDireita[i]}
                      placeholder="<"
                      onChange={(e) => handleInputChange(i, e.target.value, setDadosOsseaDireita, dadosOsseaDireita)}
                    />
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* COLUNA CENTRAL: Gráfico (Visualização) */}
        <section className="xl:col-span-6 bg-white p-4 rounded-lg shadow-md border border-slate-200 min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-slate-300 to-blue-400"></div>
          <div className="flex-1 w-full relative mt-2">
            {/* Componente Chart Isolado */}
            <AudiogramChart 
              aereaDireita={dadosAereaDireita}
              osseaDireita={dadosOsseaDireita}
              aereaEsquerda={dadosAereaEsquerda}
              osseaEsquerda={dadosOsseaEsquerda}
            />
          </div>
        </section>

        {/* COLUNA DIREITA: Orelha Esquerda (Inputs) */}
        <section className="xl:col-span-3 bg-white p-5 rounded-lg shadow-sm border-t-4 border-t-blue-500">
          <h2 className="flex items-center gap-2 font-bold text-blue-600 mb-6 pb-2 border-b border-slate-100">
            Orelha Esquerda (OE)
          </h2>

          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-6">
            {/* Linha Aérea */}
            <div className="flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-400 rotate-180" style={{writingMode: 'vertical-rl'}}>AÉREA</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {FREQUENCIAS.map((freq, i) => (
                  <div key={`oe-va-${i}`} className="text-center">
                    <label className="block text-[9px] text-slate-400 mb-1">{freq}</label>
                    <input 
                      className="w-full border border-slate-200 rounded p-1 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all font-mono"
                      value={dadosAereaEsquerda[i]}
                      placeholder="-"
                      onChange={(e) => handleInputChange(i, e.target.value, setDadosAereaEsquerda, dadosAereaEsquerda)}
                    />
                  </div>
               ))}
            </div>

            {/* Linha Óssea */}
            <div className="flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-400 rotate-180" style={{writingMode: 'vertical-rl'}}>ÓSSEA</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {FREQUENCIAS.map((freq, i) => (
                  <div key={`oe-vo-${i}`} className="text-center">
                    <input 
                      className="w-full border border-slate-200 rounded p-1 text-center text-sm bg-blue-50/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-blue-300 font-mono"
                      value={dadosOsseaEsquerda[i]}
                      placeholder=">"
                      onChange={(e) => handleInputChange(i, e.target.value, setDadosOsseaEsquerda, dadosOsseaEsquerda)}
                    />
                  </div>
               ))}
            </div>
          </div>
        </section>

      </div>

      {/* BOTÃO FLUTUANTE DE SALVAR */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white font-bold shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all group"
        >
          <Save size={20} className="group-hover:text-emerald-400 transition-colors" />
          <span>Salvar Audiometria</span>
        </button>
      </div>

    </div>
  );
}