"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText,
  Users,
  ArrowLeft,
  Briefcase,
  Factory
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function WorkersListPage() {
  const { currentCompany } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Busca os dados reais com relacionamentos
  useEffect(() => {
    async function fetchWorkers() {
      if (!currentCompany) return;
      
      try {
        setLoading(true);
        // Seleciona o funcionário E os nomes do GHE e Cargo relacionados
        const { data, error } = await supabase
          .from("workers")
          .select(`
            *,
            ghes ( name ),
            job_roles ( name )
          `)
          .eq("company_id", currentCompany.id)
          .order("name", { ascending: true });

        if (error) throw error;
        setWorkers(data || []);
      } catch (err: any) {
        toast.error("Erro ao carregar lista: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, [currentCompany]);

  // Filtro de busca (Local)
  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (worker.cpf && worker.cpf.includes(searchTerm))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium mb-2"
      >
        <ArrowLeft size={18} />
        Voltar para o Dashboard
      </button>

      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Colaboradores
          </h1>
          <p className="text-slate-500">
            Gerencie os funcionários da {currentCompany?.trade_name}
          </p>
        </div>
        <Link 
          href="/hub/workers/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <UserPlus size={18} />
          Novo Funcionário
        </Link>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CPF..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 w-48 bg-slate-100 rounded"></div>
              <span className="mt-4 text-sm">Carregando colaboradores...</span>
            </div>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">Nenhum funcionário encontrado</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm ? "Tente buscar com outro termo." : "Comece cadastrando seu primeiro colaborador."}
            </p>
            {!searchTerm && (
              <Link href="/hub/workers/new" className="text-blue-600 font-medium hover:underline">
                Cadastrar agora
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nome / Dados Pessoais</th>
                  <th className="px-6 py-4">Vínculo (Cargo/GHE)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50 transition-colors group">
                    
                    {/* COLUNA NOME (CLICÁVEL) */}
                    <td className="px-6 py-4">
                      <Link 
                        href={`/hub/workers/${worker.id}`} 
                        className="font-bold text-slate-800 hover:text-blue-600 hover:underline text-base mb-1 block transition-colors"
                      >
                        {worker.name}
                      </Link>
                      <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                        <span>CPF: {worker.cpf || "---"}</span>
                        <span>{worker.sex === 'M' ? 'Masculino' : 'Feminino'} • Adm: {worker.admission_date ? new Date(worker.admission_date).toLocaleDateString() : "--/--"}</span>
                      </div>
                    </td>

                    {/* COLUNA VÍNCULO */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Briefcase size={14} className="text-slate-400" />
                          <span className="font-medium">{worker.job_roles?.name || "Cargo não definido"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Factory size={14} className="text-slate-400" />
                          <span>{worker.ghes?.name || "Setor não definido"}</span>
                        </div>
                      </div>
                    </td>

                    {/* COLUNA STATUS */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${worker.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}
                      `}>
                        {worker.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* COLUNA AÇÕES */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/hub/workers/${worker.id}`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                          title="Abrir Prontuário"
                        >
                          <FileText size={18} />
                        </Link>
                        <button className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}