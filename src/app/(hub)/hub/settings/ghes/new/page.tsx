"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, Save, Factory, Loader2, Info, Volume2 } from "lucide-react";

export default function NewGhePage() {
  const router = useRouter();
  const { currentCompany } = useAuth();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    activities: "",
    noise_level_db: "" // Novo campo (String temporária para input)
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;

    if (!formData.name) {
      toast.error("O nome do GHE é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      // Converte o DB para número ou null se estiver vazio
      const dbValue = formData.noise_level_db ? parseFloat(formData.noise_level_db) : null;

      const { error } = await supabase.from("ghes").insert({
        company_id: currentCompany.id,
        name: formData.name,
        description: formData.description,
        activities: formData.activities,
        noise_level_db: dbValue, // Salva o valor numérico
        is_active: true
      });

      if (error) throw error;

      toast.success("GHE e Nível de Ruído salvos!");
      router.push("/hub/settings/ghes");
      router.refresh();
      
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* CARTÃO 1: IDENTIFICAÇÃO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-xl text-white shadow-md">
              <Factory size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Novo GHE / Setor</h2>
              <p className="text-sm text-slate-500">Definição do grupo para o PGR e PCMSO.</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Nome do GHE <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ex: GHE 01 - Produção"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Descrição do Ambiente
              </label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                placeholder="Descreva o local de trabalho..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Atividades Realizadas
              </label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-slate-50"
                placeholder="Descreva as tarefas reais do grupo..."
                value={formData.activities}
                onChange={e => setFormData({...formData, activities: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* CARTÃO 2: RISCOS FÍSICOS (CRÍTICO PARA O PCA) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center gap-2 font-bold text-orange-800">
            <Volume2 size={20} />
            Exposição ao Ruído (PCA)
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nível de Pressão Sonora (dB)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full pl-4 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-800"
                    placeholder="0.0"
                    value={formData.noise_level_db}
                    onChange={e => setFormData({...formData, noise_level_db: e.target.value})}
                  />
                  <span className="absolute right-4 top-2.5 text-slate-400 font-medium">dB(A)</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Conforme <strong>NR-07 Anexo II</strong>:<br/>
                  • Acima de <strong>80 dB(A)</strong>: Nível de Ação (Requer audiometria preventiva).<br/>
                  • Acima de <strong>85 dB(A)</strong>: Limite de Tolerância (Uso obrigatório de EPI).
                </p>
              </div>

              {/* Indicador Visual do Risco */}
              <div className="hidden md:block w-1/2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Interpretação Automática</h4>
                {formData.noise_level_db ? (
                  (() => {
                    const val = parseFloat(formData.noise_level_db);
                    if (val >= 85) return (
                      <div className="text-red-600 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="font-bold text-sm">Risco Alto (Limite Excedido)</span>
                      </div>
                    );
                    if (val >= 80) return (
                      <div className="text-orange-600 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <span className="font-bold text-sm">Nível de Ação (Atenção)</span>
                      </div>
                    );
                    return (
                      <div className="text-emerald-600 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-sm">Abaixo do Nível de Ação</span>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-slate-400 text-sm italic">Digite o valor para ver a classificação.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
           <button 
             type="button"
             onClick={() => router.back()}
             className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
           >
              Cancelar
           </button>
           <button 
             type="submit" 
             disabled={loading} 
             className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-200 transition-all disabled:opacity-70"
           >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Salvar GHE
           </button>
        </div>
      </form>
    </div>
  );
}