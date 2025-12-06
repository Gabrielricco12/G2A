import React, { useState } from 'react';
import { Save, Loader2, Mail, Phone, MapPin, Hash, User, AlertCircle } from 'lucide-react';
import { employeeService } from '../services/employeeService';

export function EmployeeGeneralTab({ employee, onUpdate }) {
  const [formData, setFormData] = useState({
    email: employee?.email || '',
    telefone: employee?.telefone || '',
    cep: employee?.cep || '',
    logradouro: employee?.logradouro || '',
    numero: employee?.numero || '',
    bairro: employee?.bairro || '',
    cidade: employee?.cidade || '',
    estado: employee?.estado || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await employeeService.updateEmployee(employee.id, formData);
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      if (onUpdate) onUpdate(); // Recarrega dados no pai
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar dados.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      
      {/* Seção de Contato */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User size={16} /> Contato & Pessoal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> Email
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone size={14} className="text-blue-500" /> Telefone / WhatsApp
            </label>
            <input 
              type="tel" 
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Seção Endereço */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MapPin size={16} /> Endereço Residencial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-slate-500 mb-1 block">CEP</label>
            <input 
              type="text" name="cep" value={formData.cep} onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Logradouro</label>
            <input 
              type="text" name="logradouro" value={formData.logradouro} onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Número</label>
            <input 
              type="text" name="numero" value={formData.numero} onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Bairro</label>
            <input 
              type="text" name="bairro" value={formData.bairro} onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Cidade/UF</label>
            <div className="flex gap-2">
              <input 
                type="text" name="cidade" value={formData.cidade} onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
              />
              <input 
                type="text" name="estado" value={formData.estado} onChange={handleChange} maxLength={2}
                className="w-16 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-center uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback e Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex-1">
          {message && (
            <span className={`text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              <AlertCircle size={16} /> {message.text}
            </span>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}