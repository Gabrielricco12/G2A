"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Factory, 
  Plus, 
  Search, 
  Trash2, 
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GhesListPage() {
  const { currentCompany } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [ghes, setGhes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar GHEs
  useEffect(() => {
    async function fetchGhes() {
      if (!currentCompany) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("ghes")
          .select("*")
          .eq("company_id", currentCompany.id)
          .order("name", { ascending: true });

        if (error) throw error;
        setGhes(data || []);
      } catch (err: any) {
        toast.error("Erro ao carregar GHEs.");
      } finally {
        setLoading(false);
      }
    }

    fetchGhes();
  }, [currentCompany]);

  // Excluir GHE
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza? Isso pode afetar funcionários vinculados.")) return;

    try {
      const { error } = await supabase
        .from("ghes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setGhes(ghes.filter(g => g.id !== id));
      toast.success("GHE removido.");
    } catch (err) {
      toast.error("Erro ao excluir. Verifique vínculos.");
    }
  };

  const filteredGhes = ghes.filter(ghe => 
    ghe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        Voltar para Configurações
      </button>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Factory className="text-purple-600" />
            GHEs e Setores
          </h1>
          <p className="text-slate-500">
            Gerencie os Grupos Homogêneos de Exposição da {currentCompany?.trade_name}
          </p>
        </div>
        <Link 
          href="/hub/settings/ghes/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Novo GHE
        </Link>
      </div>

      {/* BUSCA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do setor..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Carregando setores...</div>
        ) : filteredGhes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Factory className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum GHE encontrado</h3>
            <p className="text-slate-500 mb-4">Cadastre os ambientes de trabalho da empresa.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nome do GHE / Setor</th>
                <th className="px-6 py-4">Descrição do Ambiente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGhes.map((ghe) => (
                <tr key={ghe.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {ghe.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-md truncate">
                    {ghe.description || "---"}
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                       Ativo
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(ghe.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir GHE"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}