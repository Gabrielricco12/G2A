import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService';

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await companyService.getCompanies();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCompany = useCallback(async (newCompanyData) => {
    try {
      // Optimistic update poderia ser feito aqui, mas vamos garantir consistência primeiro
      const createdCompany = await companyService.createCompany(newCompanyData);
      setCompanies(prev => [...prev, createdCompany]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    refetch: fetchCompanies,
    addCompany
  };
}