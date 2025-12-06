import React, { useState } from 'react';
import { X, Loader2, Save, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddCompanyModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    grau_risco: '1', // Default seguro
    ramo_atividade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Novos estados para a busca de CNPJ
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false);
  const [cnpjError, setCnpjError] = useState(null);
  const [cnpjSuccess, setCnpjSuccess] = useState(false);

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCnpjSearch = async () => {
    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      setCnpjError('CNPJ inválido. Digite 14 números.');
      return;
    }

    setIsSearchingCnpj(true);
    setCnpjError(null);
    setCnpjSuccess(false);

    try {
      // Usando BrasilAPI (Não requer chave para consulta básica)
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      
      if (!response.ok) {
        throw new Error('Empresa não encontrada ou erro na consulta.');
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        nome: data.razao_social || data.nome_fantasia, // Prioriza Razão Social para documentos formais
        ramo_atividade: data.cnae_fiscal_descricao,
        // Aqui poderíamos preencher endereço também se o backend suportasse
      }));

      setCnpjSuccess(true);
      
      // Remove o sucesso após 3 segundos para limpar a UI
      setTimeout(() => setCnpjSuccess(false), 3000);

    } catch (err) {
      console.error(err);
      setCnpjError('Erro ao buscar dados. Verifique o CNPJ.');
    } finally {
      setIsSearchingCnpj(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Remove formatação do CNPJ antes de enviar se o backend esperar apenas números
    // const payload = { ...formData, cnpj: formData.cnpj.replace(/\D/g, '') };
    
    const result = await onSave(formData);
    
    setIsSubmitting(false);
    if (result?.success) {
      setFormData({ nome: '', cnpj: '', grau_risco: '1', ramo_atividade: '' });
      setCnpjSuccess(false);
      setCnpjError(null);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setFormData(prev => ({ ...prev, [name]: formatCNPJ(value) }));
      if (cnpjError) setCnpjError(null); // Limpa erro ao digitar
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Nova Empresa</h2>
                <p className="text-xs text-slate-500 mt-0.5">Preencha os dados ou busque pelo CNPJ</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200/80 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Grid: CNPJ (Com Busca) & Risco */}
              <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">CNPJ</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0001-00"
                      maxLength={18}
                      className={`w-full pl-3 pr-10 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        cnpjError 
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
                          : cnpjSuccess 
                            ? 'border-green-300 focus:ring-green-100 focus:border-green-400'
                            : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400 group-hover:border-slate-300'
                      }`}
                    />
                    
                    {/* Botão de Busca Absoluto dentro do Input */}
                    <button
                      type="button"
                      onClick={handleCnpjSearch}
                      disabled={isSearchingCnpj || formData.cnpj.length < 14}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title="Buscar dados na Receita"
                    >
                      {isSearchingCnpj ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      ) : cnpjSuccess ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {cnpjError && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-1.5 text-xs text-red-500 ml-1">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {cnpjError}
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Grau de Risco</label>
                  <div className="relative">
                    <select
                      name="grau_risco"
                      value={formData.grau_risco}
                      onChange={handleChange}
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none cursor-pointer hover:border-slate-300"
                    >
                      <option value="1">Grau 1 (Leve)</option>
                      <option value="2">Grau 2 (Médio)</option>
                      <option value="3">Grau 3 (Grave)</option>
                      <option value="4">Grau 4 (Máximo)</option>
                    </select>
                    {/* Seta customizada para o select */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Razão Social / Nome Fantasia *</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Indústria Metalúrgica Ltda"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all hover:border-slate-300"
                />
              </div>

              {/* Ramo de Atividade */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Ramo de Atividade (CNAE)</label>
                <input
                  type="text"
                  name="ramo_atividade"
                  value={formData.ramo_atividade}
                  onChange={handleChange}
                  placeholder="Ex: Fabricação de Estruturas Metálicas"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all hover:border-slate-300"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Empresa
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}