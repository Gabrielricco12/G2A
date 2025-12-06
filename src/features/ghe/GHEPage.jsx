import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HardHat, 
  Plus, 
  Search, 
  Volume2, 
  Users, 
  MoreVertical, 
  AlertTriangle,
  CheckCircle2,
  Ear
} from 'lucide-react';
import { useGHE } from './hooks/useGHE';
import { AddGHEModal } from '../../components/AddGHEModal';

// --- SUBCOMPONENTES ---

const GHECard = ({ ghe }) => {
  // Lógica de Risco NR-15 / NHO-01
  const noiseLevel = Number(ghe.nivel_ruido_dba) || 0;
  let status = { color: 'emerald', label: 'Tolerável', icon: CheckCircle2 };
  
  if (noiseLevel >= 85) {
    status = { color: 'rose', label: 'Insalubre (>85dB)', icon: AlertTriangle };
  } else if (noiseLevel >= 80) {
    status = { color: 'amber', label: 'Nível de Ação', icon: Volume2 };
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-[2rem] p-6 
                 bg-white/40 backdrop-blur-xl border border-white/60 
                 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Brilho Superior */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/60 shadow-sm flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
            <HardHat size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{ghe.nome}</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">
              {ghe.nome_setor || 'Setor Geral'}
            </p>
          </div>
        </div>
        
        {/* Badge de Nível de Ruído */}
        <div className={`flex flex-col items-end`}>
          <span className="text-2xl font-bold text-slate-700 tabular-nums">
            {noiseLevel} <span className="text-sm font-medium text-slate-400">dB(A)</span>
          </span>
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 border ${
            status.color === 'rose' ? 'bg-rose-100 text-rose-700 border-rose-200' :
            status.color === 'amber' ? 'bg-amber-100 text-amber-700 border-amber-200' :
            'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            <status.icon size={10} />
            {status.label}
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-6 line-clamp-2 min-h-[2.5rem] relative z-10">
        {ghe.descricao || 'Sem descrição das atividades.'}
      </p>

      {/* Footer com Metadados */}
      <div className="flex items-center justify-between pt-4 border-t border-white/40 relative z-10">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Users size={16} />
          <span>{ghe.total_trabalhadores || 0} Vidas</span>
        </div>
        
        <div className="flex items-center gap-2">
           {noiseLevel >= 80 && (
             <div className="flex -space-x-2" title="EPI Obrigatório">
               <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-xs font-bold">
                 <Ear size={14} />
               </div>
             </div>
           )}
           <button className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-400 hover:text-blue-600">
             <MoreVertical size={18} />
           </button>
        </div>
      </div>
      
      {/* Background Decorativo Condicional ao Risco */}
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-500 ${
         status.color === 'rose' ? 'bg-rose-500' :
         status.color === 'amber' ? 'bg-amber-500' :
         'bg-blue-500'
      }`} />
    </motion.div>
  );
};

// --- PÁGINA PRINCIPAL ---

export function GHEPage() {
  const { ghes, isLoading, saveGHE } = useGHE(); // Hook de dados
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do Modal

  // Filtro local
  const filteredGHEs = ghes.filter(g => 
    g.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.nome_setor && g.nome_setor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 relative min-h-full pb-20">
      {/* Background Orbs específicos desta página */}
      <div className="fixed top-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            GHE & Riscos <span className="text-slate-300 font-light">|</span> Gestão
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Mapeamento de Grupos Homogêneos de Exposição (NR-09)</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)} // Abre o Modal
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 font-semibold flex items-center gap-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={20} strokeWidth={2.5} className="relative z-10" />
          <span className="relative z-10">Novo GHE</span>
        </motion.button>
      </div>

      {/* Toolbar de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome do GHE, setor ou atividade..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtros Rápidos */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {['Todos', 'Críticos (>85dB)', 'Atenção (80-85dB)', 'Seguros'].map((filter, idx) => (
            <button 
              key={idx}
              className={`px-4 py-3.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border border-transparent ${
                idx === 0 
                ? 'bg-white shadow-sm text-blue-700 border-white/60' 
                : 'bg-white/30 text-slate-500 hover:bg-white/50 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de GHEs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence>
          {filteredGHEs.map((ghe) => (
            <GHECard key={ghe.id} ghe={ghe} />
          ))}
          
          {/* Card de Adicionar Rápido */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)} // Abre o Modal
            className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-dashed border-slate-300/60 bg-white/10 backdrop-blur-sm transition-all group min-h-[220px]"
          >
            <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="font-bold text-slate-600 group-hover:text-blue-700">Adicionar Grupo</span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* MODAL DE CRIAÇÃO (Novo) */}
      <AddGHEModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveGHE}
      />
    </div>
  );
}