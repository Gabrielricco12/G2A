import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Plus, Loader2, FileText } from 'lucide-react';
import { evolutionService } from '../services/evolutionService';

export function EmployeeEvolutionTab({ employeeId }) {
  const [evolutions, setEvolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Estado para nova evolução
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState('avaliacao_inicial');

  const fetchEvolutions = async () => {
    try {
      const data = await evolutionService.getEvolutions(employeeId);
      setEvolutions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvolutions();
  }, [employeeId]);

  const handleSave = async () => {
    if (!newNote.trim()) return;
    
    try {
      await evolutionService.addEvolution({
        trabalhador_id: employeeId,
        descricao: newNote,
        tipo_registro: newType,
        data_registro: new Date().toISOString()
      });
      setNewNote('');
      setIsAdding(false);
      fetchEvolutions(); // Atualiza lista
    } catch (error) {
      alert('Erro ao salvar evolução');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header e Ação */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Activity className="text-blue-500" /> Prontuário Clínico
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Nova Evolução
        </button>
      </div>

      {/* Form de Adição (Toggle) */}
      {isAdding && (
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm mb-6 space-y-3">
          <div className="flex gap-2">
            <select 
              value={newType} 
              onChange={(e) => setNewType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="avaliacao_inicial">Avaliação Inicial</option>
              <option value="reavaliacao">Reavaliação</option>
              <option value="orientacao">Orientação/Treinamento</option>
              <option value="retorno">Retorno</option>
            </select>
          </div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Descreva a evolução clínica, queixas do paciente ou orientações sobre EPI..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-24"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-slate-500 text-sm hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Salvar Registro</button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : evolutions.length === 0 ? (
        <div className="text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          Nenhum registro clínico encontrado.
        </div>
      ) : (
        <div className="space-y-0 relative pl-4 border-l-2 border-slate-200 ml-3">
          {evolutions.map((evo) => (
            <div key={evo.id} className="mb-8 relative pl-6 group">
              {/* Dot da Timeline */}
              <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm group-hover:scale-125 transition-transform" />
              
              <div className="bg-white/60 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                    {evo.tipo_registro.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(evo.data_registro).toLocaleDateString('pt-BR')} às {new Date(evo.data_registro).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {evo.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}