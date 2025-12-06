import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function MainLayout() {
  // Inicia FECHADO em todas as resoluções (Mobile e Desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar (Agora se comporta como Overlay em tudo) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            {/* Botão Hambúrguer (Sempre Visível) */}
            <button 
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 active:scale-95"
              title="Abrir Menu"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">G2A System</h2>
              <p className="text-xs text-slate-500 hidden sm:block">Gerenciamento Integrado</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer shadow-sm border border-blue-200">
              DR
            </div>
          </div>
        </header>

        {/* Conteúdo com Scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}