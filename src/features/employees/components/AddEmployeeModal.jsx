import React, { useState } from 'react';
import { X, Save, Loader2, User, Calendar, Briefcase, Hash, MapPin, Search, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGHE } from '../../ghe/hooks/useGHE';

export function AddEmployeeModal({ isOpen, onClose, onSave }) {
  const { ghes } = useGHE();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    matricula: '',
    data_nascimento: '',
    sexo: 'M',
    data_admissao: '',
    ghe_id: '',
    status: 'ativo',
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepError, setCepError] = useState(null);

  // --- MÁSCARAS ---
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === 'cep') {
      setFormData(prev => ({ ...prev, [name]: formatCEP(value) }));
      setCepError(null); // Limpa erro ao digitar
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- BUSCA DE CEP ---
  const handleCepSearch = async () => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      setCepError('CEP inválido.');
      return;
    }

    setIsSearchingCep(true);
    setCepError(null);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado.');
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        logradouro: data.street || '',
        bairro: data.neighborhood || '',
        cidade: data.city || '',
        estado: data.state || ''
      }));

      // Foca no campo número após buscar
      document.getElementById('numero_input')?.focus();

    } catch (err) {
      console.error(err);
      setCepError('CEP não encontrado ou erro na busca.');
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Tratamento opcional: remover máscaras antes de enviar
    // const payload = { ...formData, cpf: formData.cpf.replace(/\D/g, ''), cep: formData.cep.replace(/\D/g, '') };

    const result = await onSave(formData);
    
    setIsSubmitting(false);
    if (result?.success) {
      // Reset form
      setFormData({
        nome: '', cpf: '', matricula: '', data_nascimento: '', sexo: 'M', 
        data_admissao: '', ghe_id: '', status: 'ativo',
        cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Novo Funcionário</h2>
                  <p className="text-sm text-slate-500 mt-1">Cadastro completo (eSocial S-2200)</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1">
                
                <div className="space-y-8">
                  
                  {/* SEÇÃO 1: DADOS PESSOAIS */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={14} /> Identificação
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo *</label>
                        <input
                          type="text"
                          name="nome"
                          required
                          placeholder="Ex: João da Silva"
                          value={formData.nome}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">CPF *</label>
                        <input
                          type="text"
                          name="cpf"
                          required
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleChange}
                          maxLength={14}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Data Nascimento</label>
                        <input
                          type="date"
                          name="data_nascimento"
                          value={formData.data_nascimento}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO 2: DADOS CONTRATUAIS */}
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase size={14} /> Contratual
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Matrícula (eSocial)</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            name="matricula"
                            placeholder="Ex: 00452"
                            value={formData.matricula}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">GHE (Risco)</label>
                        <select
                          name="ghe_id"
                          value={formData.ghe_id}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Selecione um GHE...</option>
                          {ghes.map(ghe => (
                            <option key={ghe.id} value={ghe.id}>{ghe.nome}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Data Admissão</label>
                        <input
                          type="date"
                          name="data_admissao"
                          value={formData.data_admissao}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO 3: ENDEREÇO */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin size={14} /> Endereço Residencial
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* CEP com Busca */}
                      <div className="md:col-span-3 relative">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">CEP</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="cep"
                            placeholder="00000-000"
                            maxLength={9}
                            value={formData.cep}
                            onChange={handleChange}
                            className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${cepError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                          />
                          <button
                            type="button"
                            onClick={handleCepSearch}
                            disabled={isSearchingCep}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            {isSearchingCep ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                          </button>
                        </div>
                        {cepError && <span className="text-xs text-red-500 mt-1">{cepError}</span>}
                      </div>

                      <div className="md:col-span-7">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Logradouro</label>
                        <input
                          type="text"
                          name="logradouro"
                          value={formData.logradouro}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Número</label>
                        <input
                          id="numero_input"
                          type="text"
                          name="numero"
                          value={formData.numero}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Bairro</label>
                        <input
                          type="text"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
                        <input
                          type="text"
                          name="estado"
                          maxLength={2}
                          value={formData.estado}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </form>

              {/* Footer Fixo */}
              <div className="px-8 py-4 border-t border-slate-100 bg-white/50 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit} // Trigger externo para o form
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
                      Salvar Funcionário
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}