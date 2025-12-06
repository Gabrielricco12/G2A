import { supabase } from '../../../lib/supabaseClient';

export const evolutionService = {
  async getEvolutions(employeeId) {
    const { data, error } = await supabase
      .from('evolucoes_fono')
      .select('*')
      .eq('trabalhador_id', employeeId)
      .order('data_registro', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async addEvolution(evolutionData) {
    const { data, error } = await supabase
      .from('evolucoes_fono')
      .insert([evolutionData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};