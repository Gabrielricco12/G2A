"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  User, 
  Activity, 
  FileText, 
  FolderOpen, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Calendar,
  Briefcase,
  Factory,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// --- COMPONENTES DAS ABAS ---

const TabOverview = ({ worker }: any) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
        <User size={18} className="text-blue-600" />
        Dados Pessoais
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">CPF</label>
          <p className="text-slate-700 font-medium">{worker.cpf}</p>
        </div>
        
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Nascimento</label>
          <p className="text-slate-700 font-medium">
            {worker.birth_date ? new Date(worker.birth_date).toLocaleDateString('pt-BR') : "---"}
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Sexo</label>
          <p className="text-slate-700 font-medium">{worker.sex === 'M' ? 'Masculino' : 'Feminino'}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Telefone</label>
          <p className="text-slate-700 font-medium flex items-center gap-1">
            <Phone size={14} className="text-slate-400" />
            {worker.phone || "---"}
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
          <p className="text-slate-700 font-medium">{worker.email || "---"}</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
        <MapPin size={18} className="text-blue-600" />
        Endereço
      </h3>
      <div className="text-slate-600">
        {worker.address_json ? (
          <>
            <p>{worker.address_json.street}, {worker.address_json.number} {worker.address_json.complement}</p>
            <p>{worker.address_json.neighborhood} - {worker.address_json.city}/{worker.address_json.state}</p>
            <p className="text-sm text-slate-400 mt-1">CEP: {worker.address_json.cep}</p>
          </>
        ) : (
          <p className="text-slate-400 italic">Endereço não cadastrado.</p>
        )}
      </div>
    </div>
  </div>
);

const TabEvolution = ({ worker }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
      <Activity size={18} className="text-blue-600" />
      Linha do Tempo
    </h3>
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
      <div className="relative pl-8">
        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded-full"></div>
        <p className="text-sm text-slate-400 mb-1">
          {new Date(worker.created_at).toLocaleDateString('pt-BR')}
        </p>
        <h4 className="font-bold text-slate-700">Cadastro Realizado</h4>
        <p className="text-slate-500 text-sm">Funcionário admitido no sistema.</p>
      </div>
    </div>
  </div>
);

const TabExams = () => (
  <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center animate-in fade-in duration-300">
    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileText className="text-blue-500" size={32} />
    </div>
    <h3 className="text-lg font-bold text-slate-700">Histórico de Exames</h3>
    <p className="text-slate-500 mb-6">Nenhum exame realizado para este funcionário ainda.</p>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Lançar Audiometria
    </button>
  </div>
);

const TabDocuments = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
      <FolderOpen size={18} className="text-blue-600" />
      Documentos Digitalizados
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer h-32">
        <span className="text-2xl mb-2">+</span>
        <span className="text-sm font-medium">Adicionar</span>
      </div>
    </div>
  </div>
);

// --- PÁGINA PRINCIPAL ---

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Resolve a Promise do params (Next.js 15 safe)
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorker() {
      try {
        // Tenta buscar COM relacionamentos
        const { data, error } = await supabase
          .from("workers")
          .select(`
            *,
            ghes (name),
            job_roles (name)
          `)
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          console.error("Erro detalhado Supabase:", error);
          throw error;
        }
        
        setWorker(data);
      } catch (err) {
        console.error("Erro ao buscar funcionário:", err);
        // Tenta buscar SEM relacionamentos (Fallback de segurança)
        const { data: simpleData } = await supabase
          .from("workers")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (simpleData) {
          setWorker(simpleData); // Carrega mesmo sem o nome do setor
          toast.warning("Carregado parcialmente (Erro de relação no Banco).");
        } else {
          toast.error("Funcionário não encontrado.");
          router.push("/hub/workers");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchWorker();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Carregando prontuário...</p>
      </div>
    );
  }

  if (!worker) return null;

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: User },
    { id: "evolution", label: "Evolução", icon: Activity },
    { id: "exams", label: "Exames", icon: FileText },
    { id: "docs", label: "Documentos", icon: FolderOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 pb-24">
      
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 uppercase border-2 border-white shadow-md">
          {worker.name ? worker.name.substring(0, 2) : "??"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">{worker.name}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${worker.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {worker.status === 'active' ? 'ATIVO' : 'INATIVO'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Briefcase size={14} />
              {worker.job_roles?.name || "Cargo não definido"}
            </div>
            <div className="flex items-center gap-1.5">
              <Factory size={14} />
              {worker.ghes?.name || "Setor não definido"}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              Admissão: {worker.admission_date ? new Date(worker.admission_date).toLocaleDateString() : "--/--/----"}
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-100 flex items-start gap-3 md:max-w-xs">
          <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-orange-800 uppercase mb-0.5">Status Auditivo</p>
            <p className="text-xs text-orange-700">Aguardando audiometria.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm">
              MENU DO PRONTUÁRIO
            </div>
            <div className="flex flex-col p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "overview" && <TabOverview worker={worker} />}
          {activeTab === "evolution" && <TabEvolution worker={worker} />}
          {activeTab === "exams" && <TabExams />}
          {activeTab === "docs" && <TabDocuments />}
        </div>
      </div>
    </div>
  );
}