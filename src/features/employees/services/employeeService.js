import { supabase } from '../../../lib/supabaseClient';

export const employeeService = {
  /**
   * Busca lista de funcionários de uma empresa específica
   * Usado na: EmployeesPage (Tabela)
   */
  async getEmployees(companyId) {
    const { data, error } = await supabase
      .from('trabalhadores')
      .select(`
        *,
        ghe (nome)
      `)
      .eq('empresa_id', companyId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw new Error(`Erro ao buscar funcionários: ${error.message}`);
    }
    
    // Mapeia para facilitar o uso no front-end
    return data.map(emp => ({
      ...emp,
      ghe_nome: emp.ghe?.nome || 'Sem GHE'
    }));
  },

  /**
   * Busca um único funcionário pelo ID com dados detalhados
   * Usado na: EmployeeDetails (Prontuário)
   */
  async getEmployeeById(id) {
    const { data, error } = await supabase
      .from('trabalhadores')
      .select(`
        *,
        ghe (nome, descricao),
        setores (nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar detalhes do funcionário:', error);
      throw new Error(`Erro ao buscar funcionário: ${error.message}`);
    }
    
    return {
      ...data,
      ghe_nome: data.ghe?.nome || 'Sem GHE',
      setor_nome: data.setores?.nome || 'Geral' // Fallback se não tiver setor
    };
  },

  /**
   * Cria um novo funcionário
   * Usado no: AddEmployeeModal
   */
  async createEmployee(employeeData) {
    // Sanitização: remove strings vazias para enviar null ao banco
    const sanitizedData = Object.fromEntries(
      Object.entries(employeeData).map(([key, value]) => [key, value === '' ? null : value])
    );

    const { data, error } = await supabase
      .from('trabalhadores')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error(`Erro ao cadastrar funcionário: ${error.message}`);
    }

    return data;
  },

  /**
   * Atualiza dados de um funcionário existente
   * Usado na: EmployeeGeneralTab
   */
  async updateEmployee(id, updates) {
    // Sanitização para updates também
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).map(([key, value]) => [key, value === '' ? null : value])
    );

    const { data, error } = await supabase
      .from('trabalhadores')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw new Error(`Erro ao atualizar: ${error.message}`);
    }
    
    return data;
  },

  /**
   * Exclui um funcionário
   * Usado na: EmployeesPage (Menu de Ações)
   */
  async deleteEmployee(id) {
    const { error } = await supabase
      .from('trabalhadores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir funcionário:', error);
      throw new Error(`Erro ao excluir funcionário: ${error.message}`);
    }
    
    return true;
  }
};