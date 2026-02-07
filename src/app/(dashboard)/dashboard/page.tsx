"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Plus, 
  Calendar,
  Clock,
  Building2, 
  Settings, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { currentCompany } = useAuth(); 
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalExams: 0,
    alteredExams: 0,
    openAlerts: 0
  });

  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function loadRealData() {
      if (!currentCompany) return;

      try {
        setLoading(true);

        const [workersRes, examsRes, alteredRes, alertsRes] = await Promise.all([
          supabase.from("workers").select("*", { count: 'exact', head: true }).eq("company_id", currentCompany.id).eq("status", "active"),
          supabase.from("audiometries").select("*", { count: 'exact', head: true }).eq("company_id", currentCompany.id),
          supabase.from("audiometries").select("*", { count: 'exact', head: true }).eq("company_id", currentCompany.id).neq("classification", "Normal"),
          supabase.from("alerts").select("*", { count: 'exact', head: true }).eq("company_id", currentCompany.id).eq("status", "open")
        ]);

        setStats({
          totalWorkers: workersRes.count || 0,
          totalExams: examsRes.count || 0,
          alteredExams: alteredRes.count || 0,
          openAlerts: alertsRes.count || 0
        });

        const total = examsRes.count || 0;
        const altered = alteredRes.count || 0;
        const normal = total - altered;
        
        setChartData([
          { name: 'Normal', value: normal, color: '#10b981' }, 
          { name: 'Alterado', value: altered, color: '#ef4444' }, 
        ]);

        const { data: recentData, error: recentError } = await supabase
          .from("audiometries")
          .select(`
            id,
            exam_date,
            classification,
            workers ( name, job_role_id )
          `)
          .eq("company_id", currentCompany.id)
          .order("exam_date", { ascending: false })
          .limit(5);

        if (recentError) throw recentError;
        setRecentExams(recentData || []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao atualizar dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadRealData();
  }, [currentCompany]);

  if (!currentCompany) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-slate-500 flex-col gap-4">
        <p>Carregando empresa...</p>
        <Link href="/hub" className="text-blue-600 hover:underline">Voltar para seleção</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto pb-24">
      
      {/* HEADER ATUALIZADO: Nome em Azul com Destaque de Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Visão Geral</h1>
          
          {/* LINK AZUL PARA CONFIGURAÇÕES */}
          <Link 
            href="/hub/settings" 
            className="group flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-all cursor-pointer w-fit p-2 -ml-2 rounded-lg hover:bg-blue-50"
            title="Clique para abrir as configurações da empresa"
          >
            {/* Ícone com fundo azul para destacar */}
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <Building2 size={20} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg underline decoration-blue-200 underline-offset-4 group-hover:decoration-blue-600 transition-all">
                  {currentCompany.trade_name}
                </span>
                <Settings size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-slate-500 font-normal mt-0.5">
                CNPJ: {currentCompany.cnpj}
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-3 items-start">
          <Link 
            href="/hub" 
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm h-10"
          >
            <Building2 size={16} />
            Trocar Empresa
          </Link>

          <Link 
            href="/hub/audiometries/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 h-10"
          >
            <Plus size={16} />
            Nova Audiometria
          </Link>
        </div>
      </div>

      {/* CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Funcionários Ativos" 
          value={stats.totalWorkers} 
          icon={<Users size={20} className="text-blue-600" />}
          color="bg-blue-50"
          href="/hub/workers" 
        />
        <StatCard 
          title="Alertas em Aberto" 
          value={stats.openAlerts} 
          icon={<AlertTriangle size={20} className="text-orange-600" />}
          color="bg-orange-50"
          alert={stats.openAlerts > 0}
        />
        <StatCard 
          title="Total de Exames" 
          value={stats.totalExams} 
          icon={<Activity size={20} className="text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard 
          title="Resultados Alterados" 
          value={stats.alteredExams} 
          icon={<FileText size={20} className="text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* SEÇÃO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-slate-400" />
            Panorama Auditivo
          </h3>
          <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
             {stats.totalExams === 0 ? (
               <div className="text-center text-slate-400 text-sm bg-slate-50 w-full h-full rounded-lg flex flex-col items-center justify-center border border-dashed border-slate-200">
                 <p>Nenhum exame lançado.</p>
                 <span className="text-xs mt-1">Cadastre o primeiro para ver o gráfico.</span>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             )}
          </div>
          {stats.totalExams > 0 && (
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Alterado</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Últimas Atividades
            </h3>
            <Link href="/hub/audiometries" className="text-sm text-blue-600 hover:underline font-medium">
              Ver histórico completo
            </Link>
          </div>
          <div className="space-y-3">
            {recentExams.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Calendar className="text-slate-300" />
                </div>
                <p className="text-slate-600 font-medium">Tudo calmo por aqui.</p>
                <p className="text-slate-400 text-sm mb-4">Nenhum exame realizado recentemente.</p>
                <Link 
                  href="/hub/audiometries/new"
                  className="text-sm bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
                >
                  Lançar Primeiro Exame
                </Link>
              </div>
            ) : (
              recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm uppercase">
                      {exam.workers?.name?.substring(0, 2) || "??"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                        {exam.workers?.name || "Funcionário não identificado"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Resultado: <span className={exam.classification === 'Normal' ? 'text-emerald-600' : 'text-red-600 font-medium'}>
                          {exam.classification || "Pendente"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block mb-1">Data do Exame</span>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, alert = false, href }: any) {
  const Content = (
    <div className={`bg-white p-5 rounded-xl border ${alert ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-100'} shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {alert && <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <span className="text-3xl font-bold text-slate-800">{value}</span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{Content}</Link> : Content;
}