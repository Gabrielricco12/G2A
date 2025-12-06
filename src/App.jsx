import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CompanySelection } from './features/companies/CompanySelection';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { GHEPage } from './features/ghe/GHEPage'; 
import { EmployeesPage } from './features/employees/EmployeesPage'; 
import { EmployeeDetails } from './features/employees/EmployeeDetails';
import { AudiogramInput } from './features/exams/components/AudiogramInput';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTA 1: Gateway / Seleção de Empresa 
          Esta é a entrada do sistema, onde o usuário escolhe o contexto de trabalho.
          Não possui Sidebar, focando totalmente na escolha.
        */}
        <Route path="/" element={<CompanySelection />} />

        {/* ROTA 2: Workspace (Layout Principal)
          Todas as rotas aqui dentro herdam o Sidebar e o Header do MainLayout.
          Aqui é onde o trabalho acontece.
        */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ghe" element={<GHEPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/exams/audiogram-input/:examId?" element={<AudiogramInput />} />
          
          {/* Placeholders para os módulos futuros (para não quebrar a navegação do Sidebar) */}
          <Route path="/employees" element={<div className="p-8 text-slate-500">Módulo de Funcionários em desenvolvimento...</div>} />
          <Route path="/exams" element={<div className="p-8 text-slate-500">Hub de Exames em desenvolvimento...</div>} />
          <Route path="/ghe" element={<div className="p-8 text-slate-500">Gestão de GHE e Riscos em desenvolvimento...</div>} />
          <Route path="/settings" element={<div className="p-8 text-slate-500">Configurações do Sistema em desenvolvimento...</div>} />
        </Route>

        {/* Fallback 
          Qualquer rota desconhecida redireciona para a seleção de empresas.
        */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;