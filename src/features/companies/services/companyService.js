import { supabase } from '@/lib/supabaseClient';

export const companyService = {
  /**
   * Busca todas as empresas cadastradas ordenadas por nome
   * @returns {Promise<Array>} Lista de empresas
   */
  async getCompanies() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar empresas:', error);
      throw new Error('Não foi possível carregar as empresas.');
    }

    return data;
  },

  /**
   * Cria uma nova empresa
   * @param {Object} companyData - Objeto com dados da empresa (nome, cnpj, etc)
   * @returns {Promise<Object>} A empresa criada
   */
  async createCompany(companyData) {
    // Tratamento básico para garantir que campos opcionais vazios vão como null, não string vazia
    const sanitizedData = Object.fromEntries(
      Object.entries(companyData).map(([key, value]) => [key, value === '' ? null : value])
    );

    const { data, error } = await supabase
      .from('empresas')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar empresa:', error);
      throw new Error(`Erro ao cadastrar empresa: ${error.message}`);
    }

    return data;
  },

  /**
   * Busca detalhes de uma empresa específica
   * @param {string} id 
   */
  async getCompanyById(id) {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza dados da empresa
   * @param {string} id 
   * @param {Object} updates 
   */
  async updateCompany(id, updates) {
    const { data, error } = await supabase
      .from('empresas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};