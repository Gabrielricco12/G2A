import { useState, useCallback, useEffect } from 'react';
import { gheService } from '../services/gheService';

export function useGHE() {
  const [ghes, setGhes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera o ID da empresa da sessão (LocalStorage por enquanto)
  const getCompanyId = () => {
    const session = localStorage.getItem('g2a_selected_company');
    return session ? JSON.parse(session).id : null;
  };

  const fetchGHEs = useCallback(async () => {
    const companyId = getCompanyId();
    if (!companyId) return;

    try {
      setIsLoading(true);
      const data = await gheService.getGHEs(companyId);
      setGhes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveGHE = async (gheData) => {
    const companyId = getCompanyId();
    if (!companyId) return { success: false, error: 'Empresa não selecionada' };

    try {
      let result;
      // Adiciona o ID da empresa automaticamente
      const payload = { ...gheData, empresa_id: companyId };

      if (gheData.id) {
        result = await gheService.updateGHE(gheData.id, payload);
        setGhes(prev => prev.map(g => g.id === result.id ? { ...g, ...result } : g));
      } else {
        result = await gheService.createGHE(payload);
        setGhes(prev => [...prev, result]);
      }
      
      // Recarrega para pegar dados de relacionamentos (setor, counts) se necessário
      fetchGHEs(); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeGHE = async (id) => {
    try {
      await gheService.deleteGHE(id);
      setGhes(prev => prev.filter(g => g.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchGHEs();
  }, [fetchGHEs]);

  return { ghes, isLoading, error, fetchGHEs, saveGHE, removeGHE };
}