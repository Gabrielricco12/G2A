import { z } from 'zod';

// === 1. SCHEMAS DE VALIDAÇÃO (Regras de Negócio) ===

// CPF deve ser string, ter 11 digitos e passar na validação matemática (faremos a função depois)
export const CPFSchema = z.string().min(11).max(14); 

// Orelha só pode ser uma dessas duas. Não existe "meio".
export const OrelhaSchema = z.enum(['DIREITA', 'ESQUERDA']);

// Frequências audiométricas padrão ouro
export const FrequenciaSchema = z.union([
  z.literal(250), z.literal(500), z.literal(1000), 
  z.literal(2000), z.literal(3000), z.literal(4000), 
  z.literal(6000), z.literal(8000)
]);

// O Limiar (Ponto no gráfico)
export const PontoAudiometricoSchema = z.object({
  frequencia: FrequenciaSchema,
  valorDb: z.number().min(-10).max(120).nullable(), // Null = Não testado
  mascaramento: z.boolean().default(false),
  viaOssea: z.boolean().default(false)
});

// O Exame Completo (A entidade principal)
export const AudiometriaSchema = z.object({
  id: z.string().uuid().optional(),
  funcionarioId: z.string().uuid(),
  dataExame: z.string().datetime(), // ISO 8601
  tipo: z.enum(['ADMISSIONAL', 'PERIODICO', 'DEMISSIONAL', 'MUDANCA_FUNCAO']),
  
  // Estrutura hierárquica para facilitar o Frontend
  dados: z.object({
    direita: z.array(PontoAudiometricoSchema),
    esquerda: z.array(PontoAudiometricoSchema)
  }),
  
  statusProcessamento: z.enum(['PENDENTE', 'PROCESSADO', 'ERRO']).default('PENDENTE')
});

// === 2. TIPOS INFERIDOS (Para usar no React) ===
// O TypeScript cria os tipos automaticamente a partir das regras acima.
export type PontoAudiometrico = z.infer<typeof PontoAudiometricoSchema>;
export type Audiometria = z.infer<typeof AudiometriaSchema>;