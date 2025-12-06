import { supabase } from '../../../lib/supabaseClient';

export const gheService = {
  /**
   * Busca GHEs de uma empresa com dados relacionados (Setor, Contagem de Vidas)
   */
  async getGHEs(companyId) {
    // Join com setores e count de trabalhadores via foreign key
    const { data, error } = await supabase
      .from('ghe')
      .select(`
        *,
        setores (nome),
        trabalhadores (count)
      `)
      .eq('empresa_id', companyId)
      .order('nome', { ascending: true });

    if (error) throw new Error(`Erro ao buscar GHEs: ${error.message}`);
    
    // Formata o count que vem do Supabase
    return data.map(ghe => ({
      ...ghe,
      total_trabalhadores: ghe.trabalhadores?.[0]?.count || 0,
      nome_setor: ghe.setores?.nome || 'Geral'
    }));
  },

  async createGHE(gheData) {
    const { data, error } = await supabase
      .from('ghe')
      .insert([gheData])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar GHE: ${error.message}`);
    return data;
  },

  async updateGHE(id, updates) {
    const { data, error } = await supabase
      .from('ghe')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar GHE: ${error.message}`);
    return data;
  },

  async deleteGHE(id) {
    const { error } = await supabase
      .from('ghe')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao excluir GHE: ${error.message}`);
    return true;
  }
};