import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  FileWarning, 
  CalendarClock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  FileText,
  Download,
  Plus
} from 'lucide-react';

// --- MOCK DATA ---
const KPI_DATA = [
  { 
    id: 1, 
    label: 'Vidas Monitoradas', 
    value: '1.248', 
    change: '+12', 
    trend: 'up', 
    icon: Users, 
    color: 'blue' 
  },
  { 
    id: 2, 
    label: 'Conformidade PCA', 
    value: '94%', 
    change: '+2.4%', 
    trend: 'up', 
    icon: CheckCircle2, 
    color: 'emerald' 
  },
  { 
    id: 3, 
    label: 'Exames Vencidos', 
    value: '34', 
    change: '-5', 
    trend: 'down', 
    icon: CalendarClock, 
    color: 'amber' 
  },
  { 
    id: 4, 
    label: 'Casos Sugestivos PAIR', 
    value: '12', 
    change: '+1', 
    trend: 'up', 
    icon: FileWarning, 
    color: 'rose' 
  },
];

const AI_INSIGHTS = [
  {
    id: 1,
    type: 'critical',
    title: 'Desencadeamento Detectado',
    message: 'Setor "Usinagem" apresentou 3 novos casos de desencadeamento de limiar em 4kHz nos últimos 30 dias. Investigação de EPI recomendada.',
    timestamp: 'Há 2 horas'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Tendência de Agravamento',
    message: 'Funcionário João Silva (Matrícula 992) apresenta piora progressiva em OD nas frequências agudas.',
    timestamp: 'Hoje, 09:30'
  }
];

// --- COMPONENTS ---

const StatCard = ({ data, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -5, scale: 1.02 }}
    // ESTILO LIQUID GLASS: Fundo semi-transparente, Blur alto, Borda clara, Sombra colorida suave
    className="relative overflow-hidden rounded-[2rem] p-6 
               bg-white/40 backdrop-blur-2xl border border-white/60 
               shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
               transition-all duration-300 group"
  >
    {/* Highlight superior (brilho do vidro) */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50" />

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3.5 rounded-2xl bg-gradient-to-br from-${data.color}-50 to-white shadow-sm border border-${data.color}-100/50 text-${data.color}-600 group-hover:scale-110 transition-transform duration-300`}>
        <data.icon size={24} strokeWidth={2.5} />
      </div>
      <div className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm ${
        data.trend === 'up' && data.color !== 'rose' ? 'bg-emerald-400/10 text-emerald-700' : 
        data.trend === 'down' && data.color === 'amber' ? 'bg-emerald-400/10 text-emerald-700' :
        'bg-rose-400/10 text-rose-700'
      }`}>
        {data.trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {data.change}
      </div>
    </div>
    
    <h3 className="text-4xl font-bold text-slate-800/90 mb-1 tracking-tight relative z-10">{data.value}</h3>
    <p className="text-slate-500 text-sm font-medium relative z-10">{data.label}</p>
    
    {/* Orb decorativo no fundo do card para profundidade */}
    <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.08] blur-2xl bg-${data.color}-500 group-hover:opacity-[0.15] transition-opacity duration-500`} />
  </motion.div>
);

const InsightCard = ({ insight }) => (
  <div className={`p-5 rounded-2xl border mb-4 relative overflow-hidden backdrop-blur-sm transition-all hover:translate-x-1 duration-300 ${
    insight.type === 'critical' 
      ? 'bg-rose-50/40 border-rose-200/60 hover:bg-rose-50/60' 
      : 'bg-amber-50/40 border-amber-200/60 hover:bg-amber-50/60'
  }`}>
    <div className="flex items-start justify-between mb-2 relative z-10">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${insight.type === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
           <BrainCircuit size={16} />
        </div>
        <span className={`text-sm font-bold tracking-tight ${insight.type === 'critical' ? 'text-rose-800' : 'text-amber-800'}`}>
          IA Insight
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/50 px-2 py-1 rounded-full">
        {insight.timestamp}
      </span>
    </div>
    <h4 className={`text-base font-bold mb-1 ${insight.type === 'critical' ? 'text-rose-900' : 'text-amber-900'}`}>
      {insight.title}
    </h4>
    <p className="text-sm text-slate-600 leading-relaxed mb-3">
      {insight.message}
    </p>
    <button className={`text-xs font-bold uppercase tracking-wide flex items-center transition-colors ${
      insight.type === 'critical' ? 'text-rose-600 hover:text-rose-800' : 'text-amber-600 hover:text-amber-800'
    }`}>
      Ver Análise Completa <ArrowUpRight size={12} className="ml-1" />
    </button>
  </div>
);

const SimpleBarChart = () => (
  <div className="h-64 flex items-end justify-between gap-3 mt-8 px-2">
    {[65, 59, 80, 81, 56, 55, 40, 70, 75, 60, 90, 85].map((height, i) => (
      <div key={i} className="w-full relative group h-full flex items-end">
        {/* Barra com Gradiente e Vidro */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 1.2, delay: 0.2 + (i * 0.05), type: "spring", damping: 15 }}
          className="w-full rounded-t-xl relative overflow-hidden backdrop-blur-sm group-hover:brightness-110 transition-all cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-400 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />
        </motion.div>
        
        {/* Tooltip Flutuante Estilo iOS */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg pointer-events-none z-20">
          {height}
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800/90 rotate-45" />
        </div>
      </div>
    ))}
  </div>
);

export function Dashboard() {
  return (
    // Container Principal com Orbs de Fundo (Refracção)
    <div className="relative min-h-full">
      {/* Background Orbs Fixos neste contexto */}
      <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="space-y-8 relative z-10">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight drop-shadow-sm">Visão Geral</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-500 font-medium">Metalúrgica Ferro Forte S.A • Unidade Matriz</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="px-5 py-2.5 bg-white/60 backdrop-blur-lg border border-white/60 text-slate-700 rounded-xl text-sm font-semibold hover:bg-white/80 transition-all shadow-sm flex items-center gap-2">
              <Download size={18} />
              <span>Relatório</span>
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 hover:opacity-100 transition-opacity" />
              <Plus size={18} strokeWidth={2.5} />
              <span>Nova Audiometria</span>
            </motion.button>
          </div>
        </div>

        {/* 2. KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_DATA.map((kpi, index) => (
            <StatCard key={kpi.id} data={kpi} index={index} />
          ))}
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts & Epidemiology) - Ocupa 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Section - Liquid Glass Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-2xl relative overflow-hidden"
            >
              {/* Brilho interno na borda */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Evolução de Exames</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Volume de audiometrias realizadas</p>
                </div>
                
                {/* Select Estilizado */}
                <div className="relative">
                  <select className="appearance-none bg-white/50 backdrop-blur-md border border-white/60 text-slate-700 text-sm font-semibold rounded-xl py-2 pl-4 pr-10 shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-white/70 transition-colors">
                    <option>Últimos 12 meses</option>
                    <option>Ano Atual (2025)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ArrowDownRight size={16} />
                  </div>
                </div>
              </div>
              
              <SimpleBarChart />
              
              <div className="flex justify-between mt-6 text-xs text-slate-400 px-2 uppercase font-bold tracking-wider">
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
              </div>
            </motion.div>

            {/* Quick Upload / Recent Files Section */}
            <div className="rounded-[2rem] border border-white/60 shadow-sm bg-white/40 backdrop-blur-xl overflow-hidden">
              <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/20">
                <h3 className="text-lg font-bold text-slate-800">Arquivos Recentes</h3>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">Ver todos</a>
              </div>
              <div className="divide-y divide-white/40">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-5 hover:bg-white/40 flex items-center justify-between transition-colors group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Lote_Audiometrias_Outubro.pdf</p>
                        <p className="text-xs text-slate-500 mt-1">Processado por Gabriel • 24 Out, 14:30</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Concluído
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Alerts & Distribution) - Ocupa 1/3 */}
          <div className="space-y-8">
            
            {/* AI Insights Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-[2.5rem] p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-2xl relative"
            >
               {/* Decorative Gradient Blob */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                  <BrainCircuit size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">Monitoramento IA</h3>
                  <p className="text-xs text-slate-500 font-medium">Análise em tempo real</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {AI_INSIGHTS.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>

              <button className="w-full mt-4 py-3.5 border border-white/60 bg-white/30 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white/60 hover:text-slate-900 transition-all shadow-sm backdrop-blur-sm">
                Central de Alertas
              </button>
            </motion.div>

            {/* Resultado Distribution (Mini) */}
            <div className="rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição</h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Normal', percent: 75, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' },
                  { label: 'Perda Não Ocupacional', percent: 15, color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
                  { label: 'Sugestivo de PAIR', percent: 10, color: 'bg-rose-500', shadow: 'shadow-rose-500/30' }
                ].map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.percent}%</span>
                    </div>
                    {/* Barra de progresso com "brilho" */}
                    <div className="w-full bg-slate-200/50 rounded-full h-3 backdrop-blur-sm overflow-hidden border border-white/30">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + (idx * 0.1), ease: "circOut" }}
                        className={`h-full rounded-full ${item.color} ${item.shadow} shadow-lg relative`} 
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}