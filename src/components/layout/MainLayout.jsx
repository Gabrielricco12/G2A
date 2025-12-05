import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function MainLayout() {
  // Estado do Sidebar
  // Desktop: Inicia aberto (true) | Mobile: Inicia fechado (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Monitora redimensionamento da tela para ajustar responsividade
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      // Se virou desktop, garante que abre (ou mantém estado anterior se preferir)
      if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
      // Se virou mobile, fecha automaticamente
      if (mobile) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile} 
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header (Mobile & Desktop Trigger) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
              title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
            >
              <Menu size={24} />
            </button>

            {/* Breadcrumbs ou Título da Página (Pode ser dinâmico depois) */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
              <p className="text-sm text-slate-500 hidden sm:block">Visão geral do Programa de Conservação Auditiva</p>
            </div>
          </div>

          {/* User Profile / Notifications Area (Placeholder) */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer">
              DR
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}