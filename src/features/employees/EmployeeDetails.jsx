import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  FileAudio, 
  Activity, 
  FileText, 
  Loader2,
  Briefcase,
  Hash,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { employeeService } from './services/employeeService';
import { EmployeeGeneralTab } from './components/EmployeeGeneralTab';
import { EmployeeEvolutionTab } from './components/EmployeeEvolutionTab';
import { EmployeeExamsTab } from './components/EmployeeExamsTab';
import { EmployeeDocumentsTab } from './components/EmployeeDocumentsTab';

export function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('data');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do menu local

  const fetchEmployeeData = async () => {
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      console.error("Erro ao carregar funcionário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const tabs = [
    { id: 'data', label: 'Dados Pessoais', icon: User },
    { id: 'evolution', label: 'Evolução Clínica', icon: Activity },
    { id: 'exams', label: 'Audiometrias', icon: FileAudio },
    { id: 'docs', label: 'Documentos', icon: FileText },
  ];

  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F4F8]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <span className="text-slate-500 font-medium">Carregando prontuário...</span>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F4F8]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Funcionário não encontrado</h2>
          <button onClick={() => navigate('/employees')} className="text-blue-600 hover:underline">Voltar para lista</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20 bg-[#F2F4F8]">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/employees')} 
            className="p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl hover:bg-white transition-all shadow-sm group text-slate-500 hover:text-blue-600"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {employee.nome}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
                employee.status === 'ativo' 
                  ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {employee.status}
              </span>
            </h1>
            <div className="text-slate-500 text-sm flex flex-wrap items-center gap-4 mt-1 font-medium">
              <span className="flex items-center gap-1.5 bg-white/40 px-2 py-0.5 rounded-lg border border-white/50">
                <Hash size={14} className="text-blue-500" /> 
                {employee.matricula || 'Sem Matrícula'}
              </span>
              <span className="flex items-center gap-1.5 bg-white/40 px-2 py-0.5 rounded-lg border border-white/50">
                <Briefcase size={14} className="text-indigo-500" />
                {employee.ghe_nome || 'GHE Não Vinculado'}
              </span>
            </div>
          </div>
        </div>

        {/* --- MENU HAMBÚRGUER INTERNO (Navegação de Abas) --- */}
        <div className="relative w-full md:w-auto z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full md:w-64 flex items-center justify-between px-5 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-700 font-semibold"
          >
            <div className="flex items-center gap-3">
              {isMenuOpen ? <X size={20} className="text-slate-500" /> : <Menu size={20} className="text-blue-600" />}
              <span>{activeTabLabel}</span>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 left-0 mt-2 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-xl overflow-hidden p-2 origin-top"
              >
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                            : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                        }`}
                      >
                        <tab.icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                        {tab.label}
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Área de Conteúdo (Agora ocupa largura total pois o menu está acima) */}
      <div className="relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[500px] relative overflow-hidden"
          >
            {/* Brilho Superior no Container */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60" />

            {/* Renderização Condicional das Abas */}
            {activeTab === 'data' && (
              <EmployeeGeneralTab 
                employee={employee} 
                onUpdate={fetchEmployeeData} 
              />
            )}
            {activeTab === 'evolution' && (
              <EmployeeEvolutionTab employeeId={employee.id} />
            )}
            {activeTab === 'exams' && (
              <EmployeeExamsTab employeeId={employee.id} />
            )}
            {activeTab === 'docs' && (
              <EmployeeDocumentsTab employeeId={employee.id} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}