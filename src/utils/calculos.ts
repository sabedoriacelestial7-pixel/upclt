import { BANCOS_ORDENADOS } from '@/data/bancos';

// Coeficientes Facta Financeira - CLT NOVO GOLD 
// Estes são os coeficientes por prazo (valor_parcela / valor_liberado)
// Prazo máximo: 36x para todos os bancos
const COEFICIENTES: Record<number, number> = {
  5: 0.258812,
  6: 0.258812,
  8: 0.205558,
  10: 0.173927,
  12: 0.153060,
  14: 0.138306,
  15: 0.132458,
  18: 0.119019,
  20: 0.112470,
  24: 0.102963,
  30: 0.083036,
  36: 0.077260,
};

// IMPORTANTE: valorMargemDisponivel da API Facta JÁ É o valor máximo da parcela permitida
// Não é necessário calcular 15% - a API já retorna o valor correto da parcela máxima

// Calcula o valor liberado baseado na parcela e número de parcelas
// Fórmula: valor_liberado = valor_parcela / coeficiente
export function calcularValorLiberado(valorParcela: number, parcelas: number): number {
  const coeficiente = COEFICIENTES[parcelas] || COEFICIENTES[36];
  const valorLiberado = valorParcela / coeficiente;
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
  sigla: string;
  taxaMensal: number;
  cor: string;
  destaque: string | null;
  valorParcela: number;
  valorLiberado: number;
  valorTotal: number;
  parcelas: number;
}

// Calcular para todos os bancos baseado na margem disponível
// IMPORTANTE: margemDisponivel JÁ É o valor da parcela máxima permitida
export function calcularTodosBancos(margemDisponivel: number, parcelas: number = PRAZO_MAXIMO): BancoCalculado[] {
  // A margem disponível é a parcela máxima permitida
  const valorParcela = Math.round(margemDisponivel * 100) / 100;
  const valorLiberado = calcularValorLiberado(valorParcela, parcelas);
  const valorTotal = calcularTotal(valorParcela, parcelas);
  
  return BANCOS_ORDENADOS.map(banco => {
    return {
      ...banco,
      valorParcela,
      valorLiberado,
      valorTotal,
      parcelas
    };
  });
}

// Obter coeficientes disponíveis para o seletor de parcelas (máximo 36x)
export function getParcelasDisponiveis(): number[] {
  return Object.keys(COEFICIENTES).map(Number).sort((a, b) => a - b);
}

// Obter coeficiente específico
export function getCoeficiente(parcelas: number): number {
  return COEFICIENTES[parcelas] || COEFICIENTES[36];
}

// Prazo máximo permitido
export const PRAZO_MAXIMO = 36;
