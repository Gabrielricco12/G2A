import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List, Loader2, AlertCircle, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanies } from './hooks/useCompanies';
import { CompanyCard } from './components/CompanyCard';
import { AddCompanyModal } from './components/AddCompanyModal';
import logoAsset from '../../assets/logo.png'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } }
};

export function CompanySelection() {
  const navigate = useNavigate();
  const { companies, isLoading, error, addCompany } = useCompanies();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeCompanies = Array.isArray(companies) ? companies : [];

  const filteredCompanies = safeCompanies.filter(company => 
    (company.nome && company.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.cnpj && company.cnpj.includes(searchTerm))
  );

  const handleSelectCompany = (company) => {
    localStorage.setItem('g2a_selected_company', JSON.stringify(company));
    navigate('/dashboard');
  };

  return (
    // AMBIENTE: Fundo neutro com Orbs de luz para gerar refracção no vidro
    <div className="min-h-screen bg-[#F2F4F8] relative overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      
      {/* BACKGROUND ORBS (Fixos para performance, mas criam a profundidade) */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed top-[20%] left-[30%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12 relative z-10">
        
        {/* HEADER */}
        <motion.div 
          variants={slideDownVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12"
        >
          <div className="flex items-center gap-6">
            {/* Logo Container: Vidro Fosco + Borda Brilhante */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="w-20 h-20 rounded-[1.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center p-3 flex-shrink-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={logoAsset} 
                alt="G2A Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
                onError={(e) => { 
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-blue-600 font-bold text-2xl">G2A</span>';
                }}
              />
            </motion.div>

            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                G2A <span className="text-slate-300 font-extralight text-3xl">|</span> Suas Empresas
              </h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">Selecione o ambiente de trabalho</p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            // Botão Liquid: Gradiente + Brilho interno
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all font-semibold flex items-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-5 h-5 relative z-10" strokeWidth={3} />
            <span className="relative z-10">Nova Empresa</span>
          </motion.button>
        </motion.div>

        {/* TOOLBAR: A Barra de Vidro Flutuante */}
        <motion.div 
          variants={slideDownVariants}
          initial="hidden"
          animate="visible"
          className="sticky top-4 z-50 mb-10" // Sticky para ficar presa no topo ao rolar
        >
          <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-2 rounded-[1.5rem] flex flex-col sm:flex-row gap-2 items-center justify-between">
            
            {/* Input Search: Cápsula interna */}
            <div className="relative w-full sm:w-[28rem] group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-slate-100/50 hover:bg-white/80 focus:bg-white border-transparent focus:border-white/60 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                placeholder="Buscar por nome, CNPJ ou risco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle: Segmented Control estilo iOS */}
            <div className="flex bg-slate-200/50 p-1 rounded-xl relative">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-300 relative z-10 ${viewMode === 'grid' ? 'text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {viewMode === 'grid' && (
                  <motion.div layoutId="viewToggle" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <LayoutGrid className="w-5 h-5 relative z-10" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-300 relative z-10 ${viewMode === 'list' ? 'text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {viewMode === 'list' && (
                  <motion.div layoutId="viewToggle" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <List className="w-5 h-5 relative z-10" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* CONTENT GRID */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-rose-50/50 backdrop-blur-md border border-rose-200/50 rounded-2xl flex items-center text-rose-700"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center h-64"
            >
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4 opacity-80" />
              <span className="text-slate-500 font-medium tracking-wide">Carregando carteira de clientes...</span>
            </motion.div>
          ) : (
            <motion.div
              key="content-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              layout
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
            >
              <AnimatePresence>
                {/* Empty State Clean */}
                {filteredCompanies.length === 0 && !isLoading && !searchTerm && (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} className="col-span-full text-center py-20 opacity-50">
                      <p>Comece adicionando uma nova empresa.</p>
                   </motion.div>
                )}

                {filteredCompanies.map((company) => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onSelect={handleSelectCompany} 
                  />
                ))}
                
                {/* Botão de Adicionar "Fantasma" (Glass Style) */}
                {viewMode === 'grid' && !searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-dashed border-slate-300/50 bg-white/20 backdrop-blur-sm hover:bg-white/40 hover:border-blue-300/50 transition-all group h-full min-h-[220px]"
                  >
                    <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-lg font-semibold text-slate-600 group-hover:text-blue-600">Novo Cliente</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addCompany}
      />
    </div>
  );
}