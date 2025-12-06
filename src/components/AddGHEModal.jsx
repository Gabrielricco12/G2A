import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertTriangle, Volume2, Info, Ear } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddGHEModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    setor_nome: '', // Apenas visual por enquanto
    descricao: '',
    nivel_ruido_dba: '',
    tempo_exposicao_horas: '8',
    uso_epi: false,
    observacoes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);

  // Efeito para calcular o risco em tempo real ao digitar o ruído
  useEffect(() => {
    const db = parseFloat(formData.nivel_ruido_dba);
    if (!isNaN(db)) {
      if (db >= 85) {
        setRiskAssessment({ level: 'critical', text: 'Insalubre (Risco Alto)', color: 'text-rose-600', bg: 'bg-rose-50' });
      } else if (db >= 80) {
        setRiskAssessment({ level: 'warning', text: 'Nível de Ação (Atenção)', color: 'text-amber-600', bg: 'bg-amber-50' });
      } else {
        setRiskAssessment({ level: 'safe', text: 'Tolerável (Seguro)', color: 'text-emerald-600', bg: 'bg-emerald-50' });
      }
      
      // Sugere uso de EPI se for crítico
      if (db >= 80) {
        setFormData(prev => ({ ...prev, uso_epi: true }));
      }
    } else {
      setRiskAssessment(null);
    }
  }, [formData.nivel_ruido_dba]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // CORREÇÃO: Mapeamento estrito para o Schema do Supabase
    // Removemos 'setor_nome' pois a coluna não existe na tabela 'ghe'
    // Renomeamos 'tempo_exposicao_horas' para 'tempo_exposicao_diaria_horas'
    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      nivel_ruido_dba: formData.nivel_ruido_dba ? parseFloat(formData.nivel_ruido_dba) : null,
      tempo_exposicao_diaria_horas: formData.tempo_exposicao_horas ? parseFloat(formData.tempo_exposicao_horas) : null,
      uso_epi: formData.uso_epi,
      observacoes: formData.observacoes,
      // Futuramente: setor_id: selectedSetorId 
    };

    // Adiciona o nome do setor nas observações temporariamente para não perder o dado
    if (formData.setor_nome) {
      payload.observacoes = `${payload.observacoes || ''} [Setor: ${formData.setor_nome}]`.trim();
    }

    const result = await onSave(payload);
    
    setIsSubmitting(false);
    if (result?.success) {
      setFormData({ nome: '', setor_nome: '', descricao: '', nivel_ruido_dba: '', tempo_exposicao_horas: '8', uso_epi: false, observacoes: '' });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 overflow-hidden">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Novo GHE</h2>
                  <p className="text-sm text-slate-500 mt-1">Grupo Homogêneo de Exposição</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                
                {/* Linha 1: Nome e Setor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do GHE *</label>
                    <input
                      type="text"
                      name="nome"
                      required
                      placeholder="Ex: Operadores de Produção"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Setor de Lotação</label>
                    <input
                      type="text"
                      name="setor_nome"
                      placeholder="Ex: Usinagem (Apenas Informativo)"
                      value={formData.setor_nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Descrição Detalhada (eSocial) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descrição das Atividades <span className="text-slate-400 font-normal">(S-2240)</span>
                  </label>
                  <textarea
                    name="descricao"
                    rows="3"
                    placeholder="Descreva o ambiente e as atividades desempenhadas..."
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Seção de Riscos (Destaque) */}
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                    <Volume2 className="text-blue-600" size={20} />
                    <h3>Avaliação de Ruído (NR-15)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nível (dB)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="nivel_ruido_dba"
                        placeholder="0.0"
                        value={formData.nivel_ruido_dba}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Exposição (h)</label>
                      <input
                        type="number"
                        step="0.5"
                        name="tempo_exposicao_horas"
                        value={formData.tempo_exposicao_horas}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium"
                      />
                    </div>

                    {/* Feedback Visual Automático */}
                    {riskAssessment && (
                      <div className={`mt-6 md:mt-0 flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold ${riskAssessment.bg} ${riskAssessment.color} border-current/20`}>
                        <AlertTriangle size={16} />
                        {riskAssessment.text}
                      </div>
                    )}
                  </div>

                  {/* Toggle de EPI */}
                  <div className="mt-6 flex items-center gap-3">
                    <label className="flex items-center cursor-pointer relative">
                      <input 
                        type="checkbox" 
                        name="uso_epi"
                        checked={formData.uso_epi}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">Uso Obrigatório de EPI?</span>
                    </label>
                    {formData.uso_epi && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
                        <Ear size={12} />
                        Requer validação de CA
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Salvar GHE
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}