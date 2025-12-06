import { supabase } from '../../../lib/supabaseClient';

export const examService = {
  // --- AGENDAMENTOS (Marcação) ---
  
  async getAppointments(employeeId) {
    const { data, error } = await supabase
      .from('agendamentos_exames')
      .select('*')
      .eq('trabalhador_id', employeeId)
      .order('data_agendamento', { ascending: false });

    if (error) throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
    return data;
  },

  async createAppointment(appointmentData) {
    const { data, error } = await supabase
      .from('agendamentos_exames')
      .insert([appointmentData])
      .select()
      .single();

    if (error) throw new Error(`Erro ao agendar: ${error.message}`);
    return data;
  },

  async updateAppointmentStatus(id, status) {
    const { error } = await supabase
      .from('agendamentos_exames')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar status: ${error.message}`);
    return true;
  },

  // --- AUDIOMETRIAS (Exames Realizados) ---

  async getExams(employeeId) {
    const { data, error } = await supabase
      .from('audiometrias')
      .select('*')
      .eq('trabalhador_id', employeeId)
      .order('data_exame', { ascending: false });

    if (error) throw new Error(`Erro ao buscar audiometrias: ${error.message}`);
    return data;
  },

  async getExamById(id) {
    const { data, error } = await supabase
      .from('audiometrias')
      .select(`
        *,
        audiometrias_medidas (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar exame: ${error.message}`);
    return data;
  },

  async saveAudiogram(examData, measures) {
    // 1. Salva o cabeçalho do exame
    const { data: exam, error: examError } = await supabase
      .from('audiometrias')
      .upsert(examData) // Cria ou atualiza se tiver ID
      .select()
      .single();

    if (examError) throw new Error(`Erro ao salvar exame: ${examError.message}`);

    // 2. Salva as medidas (limiares) se houver
    if (measures && measures.length > 0) {
      const measuresPayload = measures.map(m => ({ ...m, audiometria_id: exam.id }));
      
      // Remove medidas antigas para substituir (estratégia simples de update)
      await supabase.from('audiometrias_medidas').delete().eq('audiometria_id', exam.id);
      
      const { error: measuresError } = await supabase
        .from('audiometrias_medidas')
        .insert(measuresPayload);

      if (measuresError) throw new Error(`Erro ao salvar medidas: ${measuresError.message}`);
    }

    return exam;
  }
};