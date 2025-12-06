import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarClock, 
  FileAudio, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Calendar,
  X,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { examService } from '../../exams/services/examService';
import { AudiogramInput } from '../../exams/components/AudiogramInput';

// --- SUB-COMPONENTE: CARD DE AGENDAMENTO ---
const AppointmentCard = ({ appointment }) => {
  const statusColors = {
    agendado: 'bg-blue-100 text-blue-700 border-blue-200',
    realizado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelado: 'bg-slate-100 text-slate-500 border-slate-200',
    faltou: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  return (
    <div className="bg-white/60 p-4 rounded-xl border border-white/60 shadow-sm flex justify-between items-center group hover:bg-white/80 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[appointment.status] || statusColors.agendado}`}>
          <CalendarClock size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 capitalize">{appointment.motivo_exame?.replace('_', ' ')}</h4>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> 
              {new Date(appointment.data_agendamento).toLocaleDateString('pt-BR')}
            </span>
            <span className="capitalize text-slate-400">• {appointment.tipo_exame?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
      <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[appointment.status]}`}>
        {appointment.status}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function EmployeeExamsTab({ employeeId }) {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('scheduling'); // 'scheduling' | 'audiometry'
  const [appointments, setAppointments] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controle de telas (Lista vs Input)
  const [isExamInputOpen, setIsExamInputOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null); // Null = Novo Exame

  // Estado para formulário de novo agendamento
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    data_agendamento: '',
    tipo_exame: 'audiometria_tonal',
    motivo_exame: 'periodico',
    observacoes: ''
  });

  // Carrega dados iniciais
  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appData, examData] = await Promise.all([
        examService.getAppointments(employeeId),
        examService.getExams(employeeId)
      ]);
      setAppointments(appData || []);
      setExams(examData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleData.data_agendamento) return;

    try {
      const sessionStr = localStorage.getItem('g2a_selected_company');
      const session = sessionStr ? JSON.parse(sessionStr) : {};
      
      await examService.createAppointment({
        ...scheduleData,
        trabalhador_id: employeeId,
        empresa_id: session.id, 
        status: 'agendado'
      });
      
      setIsScheduling(false);
      setScheduleData({ data_agendamento: '', tipo_exame: 'audiometria_tonal', motivo_exame: 'periodico', observacoes: '' });
      fetchData(); 
    } catch (error) {
      alert('Erro ao agendar: ' + error.message);
    }
  };

  // Função para salvar o audiograma vindo do componente AudiogramInput
  const handleAudiogramSave = async (chartData) => {
    try {
      const sessionStr = localStorage.getItem('g2a_selected_company');
      const session = sessionStr ? JSON.parse(sessionStr) : {};

      // 1. Prepara o objeto do exame (Cabeçalho)
      const examPayload = {
        trabalhador_id: employeeId,
        empresa_id: session.id,
        data_exame: new Date().toISOString().split('T')[0], // Hoje
        tipo_audiograma: 'tonal', // Default
        motivo_exame: 'periodico', // Idealmente viria de um seletor no AudiogramInput
        // Se estiver editando, adicione o ID aqui
        ...(selectedExamId && { id: selectedExamId })
      };

      // 2. Transforma o objeto do gráfico (OD/OE) em Array de Medidas para o Banco
      const measures = [];
      
      // Itera sobre as orelhas (OD, OE)
      Object.keys(chartData).forEach(ear => { // 'OD', 'OE'
        Object.keys(chartData[ear]).forEach(via => { // 'via_aerea', 'via_ossea'
          const freqs = chartData[ear][via]; // { 250: 10, 500: 15 ... }
          
          Object.keys(freqs).forEach(freq => {
            measures.push({
              orelha: ear,
              via: via === 'via_aerea' ? 'aerea' : 'ossea',
              frequencia_hz: parseInt(freq),
              limiar_db: freqs[freq]
            });
          });
        });
      });

      // 3. Chama o Service para salvar tudo (Transação implícita)
      await examService.saveAudiogram(examPayload, measures);

      // 4. Feedback e Fechamento
      setIsExamInputOpen(false);
      setSelectedExamId(null);
      fetchData(); // Atualiza a lista
      alert('Exame salvo com sucesso!');

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar audiometria: ' + error.message);
    }
  };

  const openNewExam = () => {
    setSelectedExamId(null);
    setIsExamInputOpen(true);
  };

  const openEditExam = (exam) => {
    setSelectedExamId(exam.id);
    // TODO: Carregar dados do exame para passar como initialData para o AudiogramInput
    setIsExamInputOpen(true);
  };

  // Renderização Condicional: Se o modo de Input estiver ativo, mostra o gráfico em tela cheia (overlay na aba)
  if (isExamInputOpen) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setIsExamInputOpen(false)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {selectedExamId ? 'Editar Audiometria' : 'Nova Audiometria'}
            </h3>
            <p className="text-sm text-slate-500">Lançamento de limiares tonais</p>
          </div>
        </div>

        {/* COMPONENTE DO GRÁFICO */}
        <AudiogramInput 
          onSave={handleAudiogramSave} 
          // initialData={...} // Futuramente passar dados aqui para edição
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Navegação Interna (Sub-tabs Glass) */}
      <div className="flex p-1 bg-white/40 border border-white/60 rounded-xl w-fit mb-6">
        <button
          onClick={() => setActiveSubTab('scheduling')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'scheduling' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarClock size={16} /> Marcação
        </button>
        <button
          onClick={() => setActiveSubTab('audiometry')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'audiometry' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileAudio size={16} /> Audiometrias
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: MARCAÇÃO */}
      {activeSubTab === 'scheduling' && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Botão / Form Toggle */}
          {!isScheduling ? (
            <button 
              onClick={() => setIsScheduling(true)}
              className="w-full py-4 border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="font-bold text-sm">Novo Agendamento</span>
            </button>
          ) : (
            <form onSubmit={handleScheduleSubmit} className="bg-white/60 p-6 rounded-2xl border border-white/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-700">Agendar Exame</h4>
                <button type="button" onClick={() => setIsScheduling(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={18} /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Data</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={scheduleData.data_agendamento}
                    onChange={(e) => setScheduleData({...scheduleData, data_agendamento: e.target.value})}
                    className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Motivo</label>
                  <select 
                    value={scheduleData.motivo_exame}
                    onChange={(e) => setScheduleData({...scheduleData, motivo_exame: e.target.value})}
                    className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="admissional">Admissional</option>
                    <option value="periodico">Periódico</option>
                    <option value="demissional">Demissional</option>
                    <option value="mudanca_funcao">Mudança de Função</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          )}

          {/* Lista de Agendamentos */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Próximos Agendamentos</h4>
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Nenhum agendamento pendente.</p>
            ) : (
              appointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
            )}
          </div>
        </motion.div>
      )}

      {/* CONTEÚDO DA ABA 2: AUDIOMETRIAS */}
      {activeSubTab === 'audiometry' && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Ação Principal: Realizar Exame (Abre o AudiogramInput) */}
          <button 
            onClick={openNewExam}
            className="w-full p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 text-white flex items-center justify-between group hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Realizar Nova Audiometria</h3>
                <p className="text-emerald-100 text-sm">Abrir grade de lançamento clínico</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
              <ChevronRight size={20} />
            </div>
          </button>

          {/* Histórico */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Histórico de Exames</h4>
            {exams.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <FileAudio size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Nenhuma audiometria registrada para este funcionário.</p>
              </div>
            ) : (
              exams.map(exam => (
                <div 
                  key={exam.id} 
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => openEditExam(exam)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      exam.resultado_analise === 'alterado' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <FileAudio size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{exam.tipo_audiograma?.replace('_', ' ') || 'Tonal e Vocal'}</h4>
                      <span className="text-xs text-slate-500">{new Date(exam.data_exame).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      exam.resultado_analise === 'alterado' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {exam.resultado_analise || 'Normal'}
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}