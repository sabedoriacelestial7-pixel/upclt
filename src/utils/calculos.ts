import { BANCOS_ORDENADOS } from '@/data/bancos';

// Fatores de cálculo por número de parcelas
// Fator = usado para calcular valor liberado a partir da parcela
const FATORES_PARCELAS: Record<number, number> = {
  6: 0.178526,
  12: 0.095024,
  18: 0.067020,
  24: 0.052871,
  30: 0.044321,
  36: 0.077260,
  48: 0.030430,
  60: 0.025393,
  72: 0.022014,
  84: 0.019557,
};

// Calcula o valor da parcela baseado na margem disponível (15% da margem)
export function calcularParcelaDaMargem(margemDisponivel: number): number {
  const valorParcela = margemDisponivel * 0.15; // 15% da margem (100% - 85%)
  return Math.round(valorParcela * 100) / 100;
}

// Calcula o valor liberado baseado na parcela e número de parcelas
export function calcularValorLiberado(valorParcela: number, parcelas: number): number {
  const fator = FATORES_PARCELAS[parcelas] || 0.077260; // Default para 36x
  const valorLiberado = valorParcela / fator;
  return Math.round(valorLiberado * 100) / 100;
}

// Sistema Price - Cálculo de parcela (mantido para referência/simulações manuais)
export function calcularParcela(valor: number, parcelas: number, taxaMensal: number): number {
  const i = taxaMensal / 100;
  const n = parcelas;
  
  const parcela = valor * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  return Math.round(parcela * 100) / 100;
}

export function calcularTotal(parcela: number, numParcelas: number): number {
  return Math.round(parcela * numParcelas * 100) / 100;
}

export interface BancoCalculado {
  id: string;
  nome: string;
  logo: string;
  taxaMensal: number;
  cor: string;
  destaque: string | null;
  valorParcela: number;
  valorLiberado: number;
  valorTotal: number;
  parcelas: number;
}

// Calcular para todos os bancos baseado na margem disponível
export function calcularTodosBancos(margemDisponivel: number, parcelas: number): BancoCalculado[] {
  const valorParcela = calcularParcelaDaMargem(margemDisponivel);
  const valorLiberado = calcularValorLiberado(valorParcela, parcelas);
  
  return BANCOS_ORDENADOS.map(banco => {
    const valorTotal = calcularTotal(valorParcela, parcelas);
    
    return {
      ...banco,
      valorParcela,
      valorLiberado,
      valorTotal,
      parcelas
    };
  });
}

// Obter fatores disponíveis para o seletor de parcelas
export function getParcelasDisponiveis(): number[] {
  return Object.keys(FATORES_PARCELAS).map(Number).sort((a, b) => a - b);
}

// Obter fator específico
export function getFator(parcelas: number): number {
  return FATORES_PARCELAS[parcelas] || 0.077260;
}
