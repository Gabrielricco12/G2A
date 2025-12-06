import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação para navegação
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  User, 
  Briefcase, 
  Calendar,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  Hash
} from 'lucide-react';
import { useEmployees } from './hooks/useEmployees';
import { AddEmployeeModal } from './components/AddEmployeeModal';

// --- COMPONENTE DE LINHA DA TABELA ---
const EmployeeRow = ({ employee, index }) => {
  const navigate = useNavigate(); // Hook para navegar

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Função de navegação ao clicar na linha
  const handleRowClick = () => {
    navigate(`/employees/${employee.id}`);
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleRowClick} // Evento de clique na linha inteira
      className="group border-b border-slate-100/50 hover:bg-white/60 transition-colors cursor-pointer" // Cursor pointer para indicar clique
    >
      {/* Coluna: Nome & Avatar */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm border border-white/60 group-hover:scale-105 transition-transform">
            {getInitials(employee.nome)}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{employee.nome}</div>
            <div className="text-xs text-slate-500 font-medium">{employee.email || 'Sem email'}</div>
          </div>
        </div>
      </td>

      {/* Coluna: Matrícula/CPF */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
            <Hash size={12} className="text-slate-400" />
            {employee.matricula || 'N/D'}
          </span>
          <span className="text-xs text-slate-400 font-mono">{employee.cpf || 'CPF N/D'}</span>
        </div>
      </td>

      {/* Coluna: GHE */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100 w-fit">
          <Briefcase size={14} className="text-blue-500" />
          <span className="text-sm text-slate-600 font-medium truncate max-w-[150px]" title={employee.ghe_nome}>
            {employee.ghe_nome || 'Sem Vínculo'}
          </span>
        </div>
      </td>

      {/* Coluna: Admissão */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          {employee.data_admissao ? new Date(employee.data_admissao).toLocaleDateString('pt-BR') : '-'}
        </div>
      </td>

      {/* Coluna: Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
          employee.status === 'ativo' 
            ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' 
            : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${employee.status === 'ativo' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {employee.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      </td>

      {/* Coluna: Ações */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); // Impede que o clique no botão abra a página de detalhes
            // Lógica do menu de ações viria aqui 
          }}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white/60 rounded-lg transition-colors relative z-10"
        >
          <MoreVertical size={18} />
        </button>
      </td>
    </motion.tr>
  );
};

export function EmployeesPage() {
  const { employees, isLoading, addEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const filteredEmployees = employees.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.cpf && e.cpf.includes(searchTerm)) ||
    (e.matricula && e.matricula.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6 relative min-h-full pb-20">
      {/* Background Orbs */}
      <div className="fixed top-[20%] left-[10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Funcionários <span className="text-slate-300 font-light">|</span> Gestão
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Total de <strong className="text-blue-600">{employees.length}</strong> vidas monitoradas
          </p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 font-semibold flex items-center gap-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={20} strokeWidth={2.5} className="relative z-10" />
          <span className="relative z-10">Novo Funcionário</span>
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF ou matrícula..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="px-4 py-3.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-slate-600 font-medium hover:bg-white/60 transition-colors flex items-center gap-2 shadow-sm">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* TABELA "Liquid Glass" */}
      <div className="relative z-10 rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-white/20 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4 rounded-tl-[2rem]">Funcionário</th>
                <th className="px-6 py-4">Matrícula / CPF</th>
                <th className="px-6 py-4">Lotação (GHE)</th>
                <th className="px-6 py-4">Admissão</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-[2rem] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-60">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <span>Carregando base de dados...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <User size={32} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Nenhum funcionário encontrado</p>
                        {searchTerm && <p className="text-sm">Tente buscar por outro termo.</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentEmployees.map((emp, index) => (
                    <EmployeeRow key={emp.id} employee={emp} index={index} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer de Paginação */}
        <div className="mt-auto border-t border-slate-200/60 px-6 py-4 bg-white/30 flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Mostrando <span className="text-slate-800">{startIndex + 1}</span> - <span className="text-slate-800">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> de <span className="text-slate-800">{filteredEmployees.length}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-white/60 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="px-4 py-2 bg-white/50 rounded-xl text-sm font-bold text-blue-700 shadow-sm border border-white/60">
              Página {currentPage} de {totalPages || 1}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-xl hover:bg-white/60 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addEmployee}
      />
    </div>
  );
}