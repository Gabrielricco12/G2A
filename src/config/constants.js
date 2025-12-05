// ... (Mantenha os exports anteriores: TIPO_EXAME, MOTIVO_EXAME, ETC)

// Limites físicos do audiômetro e do gráfico
export const LIMITES_AUDIOMETRIA = {
  MIN_DB: -10,
  MAX_DB: 120,
  STEP_DB: 5, // A audiometria é registrada em passos de 5dB
};

// Mapeamento lógico para renderização do gráfico (Símbolos Padrão CFFa)
// Chave: {LADO}_{VIA}_{MASCARADO?}_{RESPOSTA?}
export const SIMBOLOS_AUDIOMETRIA = {
  // Orelha Direita (Vermelho)
  OD_AEREA_SEM_MASC: { code: 'O', color: 'red', shape: 'circle' },
  OD_AEREA_COM_MASC: { code: 'triangle', color: 'red', shape: 'triangle' },
  OD_OSSEA_SEM_MASC: { code: '<', color: 'red', shape: 'arrow-left' },
  OD_OSSEA_COM_MASC: { code: '[', color: 'red', shape: 'bracket-left' },
  
  // Orelha Esquerda (Azul)
  OE_AEREA_SEM_MASC: { code: 'X', color: 'blue', shape: 'cross' },
  OE_AEREA_COM_MASC: { code: 'square', color: 'blue', shape: 'square' },
  OE_OSSEA_SEM_MASC: { code: '>', color: 'blue', shape: 'arrow-right' },
  OE_OSSEA_COM_MASC: { code: ']', color: 'blue', shape: 'bracket-right' },

  // Modificador de Ausência de Resposta (Seta para baixo acoplada ao símbolo)
  MODIFICADOR_AUSENCIA: 'arrow-down-diagonal' 
};

// Tipos de Mascaramento (Narrow Band é o padrão para tons puros, mas existem outros)
export const TIPO_MASCARAMENTO = {
  NB: 'narrow_band', // Ruído de banda estreita (mais comum na tonal)
  WN: 'white_noise', // Ruído branco
  SN: 'speech_noise' // Ruído de fala (para logoaudiometria)
};

// Status da via no momento do input
export const STATUS_RESPOSTA = {
  PRESENTE: 'presente',
  AUSENTE: 'ausente',
  NAO_TESTADO: 'nao_testado'
};