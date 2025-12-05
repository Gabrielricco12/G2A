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
  X,
  Sparkles
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

export function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  const location = useLocation();

  const sidebarVariants = {
    expanded: { width: "280px", x: 0 }, // Um pouco mais largo para acomodar o design arejado
    collapsed: { width: "90px", x: 0 },
    mobileOpen: { x: 0, width: "280px" },
    mobileClosed: { x: "-100%", width: "280px" },
  };

  const currentVariant = isMobile 
    ? (isOpen ? 'mobileOpen' : 'mobileClosed') 
    : (isOpen ? 'expanded' : 'collapsed');

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={currentVariant}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        // ESTILO LIQUID GLASS: Fundo translúcido + Blur pesado + Borda sutil
        className={`fixed md:relative z-50 h-screen flex flex-col overflow-hidden
                    bg-white/80 backdrop-blur-3xl border-r border-white/60 
                    shadow-[4px_0_24px_rgba(0,0,0,0.02)] supports-[backdrop-filter]:bg-white/60`}
      >
        {/* Orbs de fundo sutis DENTRO do sidebar para garantir o efeito de vidro mesmo sobre fundo branco */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-slate-100/50 relative z-10">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-white/50 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                 <img 
                    src={logo} 
                    alt="G2A" 
                    className="w-6 h-6 object-contain opacity-90"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                 />
                 <Building2 className="w-5 h-5 text-blue-600 hidden" />
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col justify-center"
                >
                  <span className="font-bold text-slate-800 text-lg tracking-tight leading-none">G2A System</span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Workspace</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isMobile && (
            <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto custom-scrollbar relative z-10">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'text-blue-700 font-semibold' 
                    : 'text-slate-500 font-medium hover:text-slate-800 hover:bg-white/60'}
                `}
                title={!isOpen && !isMobile ? item.label : ""}
              >
                {/* Background Ativo estilo Liquid Glass (Gradiente + Borda Brilhante) */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border border-white/60 shadow-[0_2px_12px_rgba(59,130,246,0.08)] backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                     {/* Brilho superior */}
                     <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  </motion.div>
                )}

                <div className={`relative z-10 flex-shrink-0 transition-all duration-300 ${!isOpen && !isMobile ? 'mx-auto' : 'mr-4'} ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'}`}>
                    <item.icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                    />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="relative z-10 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Indicador de "Ativo" (Bolinha lateral) */}
                {isActive && isOpen && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  />
                )}

                {/* Tooltip Fake (Collapsed) */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-5 px-3 py-1.5 bg-slate-800/90 backdrop-blur text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                    {/* Seta do tooltip */}
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800/90 rotate-45" />
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100/50 relative z-10">
          <button className={`group relative flex items-center w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:text-rose-600 transition-colors overflow-hidden ${!isOpen && !isMobile ? 'justify-center' : ''}`}>
            
            {/* Hover Background do Logout */}
            <div className="absolute inset-0 bg-rose-50/0 group-hover:bg-rose-50/50 transition-colors duration-300" />

            <LogOut size={20} strokeWidth={2} className="flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform" />
            
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 font-medium whitespace-nowrap overflow-hidden relative z-10"
                >
                  Encerrar Sessão
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}