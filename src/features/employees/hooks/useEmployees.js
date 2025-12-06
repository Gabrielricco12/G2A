import { useState, useCallback, useEffect } from 'react';
import { employeeService } from '../services/employeeService';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCompanyId = () => {
    const session = localStorage.getItem('g2a_selected_company');
    return session ? JSON.parse(session).id : null;
  };

  const fetchEmployees = useCallback(async () => {
    const companyId = getCompanyId();
    if (!companyId) return;

    try {
      setIsLoading(true);
      const data = await employeeService.getEmployees(companyId);
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEmployee = async (employeeData) => {
    const companyId = getCompanyId();
    if (!companyId) return { success: false, error: 'Empresa não selecionada' };

    try {
      const payload = { ...employeeData, empresa_id: companyId };
      const newEmployee = await employeeService.createEmployee(payload);
      
      // Atualiza lista local (Optimistic UI like)
      setEmployees(prev => [...prev, { ...newEmployee, ghe_nome: 'Atualizando...' }]);
      fetchEmployees(); // Recarrega para pegar o join correto do GHE
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { 
    employees, 
    isLoading, 
    error, 
    fetchEmployees, 
    addEmployee 
  };
}