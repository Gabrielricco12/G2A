import React from 'react';
import { Building2, Users, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function CompanyCard({ company, onSelect }) {
  const riskColorMap = {
    '1': { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-200/50' },
    '2': { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-200/50' },
    '3': { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-200/50' },
    '4': { bg: 'bg-rose-500/10', text: 'text-rose-700', border: 'border-rose-200/50' },
    default: { bg: 'bg-slate-500/10', text: 'text-slate-700', border: 'border-slate-200/50' }
  };

  const riskStyle = riskColorMap[company.grau_risco] || riskColorMap.default;

  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(company)}
      // LIQUID GLASS CARD:
      // - bg-white/60: Permite ver sutilmente os orbs do fundo
      // - backdrop-blur-xl: Borra o que está atrás
      // - border-white/60: Borda brilhante
      className="group relative rounded-[2rem] p-6 cursor-pointer
                 bg-white/60 backdrop-blur-xl border border-white/60
                 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]
                 transition-all duration-300 overflow-hidden"
    >
      {/* Brilho Superior (Highlight) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

      {/* Header do Card */}
      <div className="relative z-10 flex justify-between items-start mb-5">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-sm border border-white/50 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300`}>
          <Building2 className="w-6 h-6" strokeWidth={2} />
        </div>
        
        {company.grau_risco && (
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>Risco {company.grau_risco}</span>
          </div>
        )}
      </div>
      
      {/* Conteúdo */}
      <div className="relative z-10 space-y-2 mb-6">
        <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors line-clamp-1" title={company.nome}>
          {company.nome}
        </h3>
        <p className="text-sm font-medium text-slate-400 font-mono tracking-tight">
          {company.cnpj || 'CNPJ não informado'}
        </p>
      </div>
      
      {/* Footer / Ação */}
      <div className="relative z-10 pt-4 border-t border-slate-100/50 flex items-center justify-between">
        <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
          <Users className="w-4 h-4 mr-2" />
          <span>Acessar Painel</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* Gradiente Decorativo no Hover */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-blue-400/0 to-blue-400/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}