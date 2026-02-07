
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  ArrowLeft,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JobRolesListPage() {
  const { currentCompany } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar Cargos
  useEffect(() => {
    async function fetchRoles() {
      if (!currentCompany) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("job_roles")
          .select("*")
          .eq("company_id", currentCompany.id)
          .order("name", { ascending: true });

        if (error) throw error;
        setRoles(data || []);
      } catch (err: any) {
        toast.error("Erro ao carregar cargos.");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, [currentCompany]);

  // Função de Excluir
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;

    try {
      const { error } = await supabase
        .from("job_roles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRoles(roles.filter(r => r.id !== id));
      toast.success("Cargo removido.");
    } catch (err) {
      toast.error("Erro ao excluir. Verifique se há funcionários vinculados.");
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.cbo && role.cbo.includes(searchTerm))
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
            <Briefcase className="text-blue-600" />
            Cargos e Funções
          </h1>
          <p className="text-slate-500">
            Defina as funções existentes na {currentCompany?.trade_name}
          </p>
        </div>
        <Link 
          href="/hub/settings/roles/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Novo Cargo
        </Link>
      </div>

      {/* BUSCA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do cargo ou CBO..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Carregando...</div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum cargo encontrado</h3>
            <p className="text-slate-500 mb-4">Comece cadastrando as funções da empresa.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nome do Cargo</th>
                <th className="px-6 py-4">CBO</th>
                <th className="px-6 py-4">Descrição Sumária</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {role.cbo || "---"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={role.description}>
                    {role.description || "Sem descrição"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Cargo"
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