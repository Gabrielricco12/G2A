"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, Save, Briefcase, Loader2 } from "lucide-react";

export default function NewJobRolePage() {
  const router = useRouter();
  const { currentCompany } = useAuth();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cbo: "",
    description: ""
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;

    if (!formData.name) {
      toast.error("O nome do cargo é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("job_roles").insert({
        company_id: currentCompany.id,
        name: formData.name,
        cbo: formData.cbo,
        description: formData.description
      });

      if (error) throw error;

      toast.success("Cargo criado com sucesso!");
      router.push("/hub/settings/roles");
      router.refresh();
      
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Novo Cargo</h2>
            <p className="text-sm text-slate-500">Cadastre uma função para vincular aos funcionários.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nome do Cargo <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Auxiliar Administrativo"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              CBO (Código Brasileiro de Ocupações)
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              placeholder="Ex: 4110-05"
              value={formData.cbo}
              onChange={e => setFormData({...formData, cbo: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-1">
              Opcional. Usado para relatórios do eSocial.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Descrição das Atividades
            </label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Descreva brevemente as atividades realizadas nesta função..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
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
               className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Salvar Cargo
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}