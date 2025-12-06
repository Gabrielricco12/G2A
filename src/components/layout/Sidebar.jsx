import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileAudio, 
  HardHat, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';
import logo from '../../assets/logo.png'; 

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Funcionários', icon: Users, path: '/employees' },
  { label: 'Exames', icon: FileAudio, path: '/exams' },
  { label: 'GHE & Riscos', icon: HardHat, path: '/ghe' },
  { label: 'Minhas Empresas', icon: Building2, path: '/' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  // Variantes para a animação de deslizar (Gaveta)
  const sidebarVariants = {
    open: { x: 0, opacity: 1, boxShadow: "10px 0px 50px rgba(0,0,0,0.1)" },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <>
      {/* BACKDROP: Fundo escuro que cobre o site quando o menu abre */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR: Menu Flutuante (Fixed) */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col overflow-hidden
                   bg-white/80 backdrop-blur-3xl border-r border-white/60 shadow-2xl"
      >
        {/* Orbs de fundo sutis DENTRO do sidebar para manter consistência do Glass */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        {/* Header do Menu */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-slate-100/50 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/50 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                 <img 
                    src={logo} 
                    alt="G2A" 
                    className="w-6 h-6 object-contain opacity-90"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                 />
                 <Building2 className="w-5 h-5 text-blue-600 hidden" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="font-bold text-slate-800 text-lg tracking-tight leading-none">G2A</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Navegação</span>
            </div>
          </div>

          {/* Botão de Fechar Interno */}
          <button 
            onClick={toggleSidebar} 
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleSidebar} // Fecha o menu ao clicar em um link
                className={`group relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'text-blue-700 font-semibold' 
                    : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-white/50'}
                `}
              >
                {/* Background Ativo estilo Liquid Glass */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavSidebar"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border border-white/60 shadow-[0_2px_12px_rgba(59,130,246,0.08)] backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                     <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  </motion.div>
                )}

                <div className={`relative z-10 flex-shrink-0 transition-all duration-300 mr-3 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'}`}>
                    <item.icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                    />
                </div>

                <span className="relative z-10 whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>

                {/* Indicador de Ativo (Dot) */}
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100/50 relative z-10">
          <button className="group relative flex items-center w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:text-rose-600 transition-colors overflow-hidden">
            <div className="absolute inset-0 bg-rose-50/0 group-hover:bg-rose-50/50 transition-colors duration-300" />
            <LogOut size={20} strokeWidth={2} className="flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform mr-3" />
            <span className="font-medium whitespace-nowrap overflow-hidden relative z-10">
              Encerrar Sessão
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}