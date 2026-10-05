export function calcularJurosAtraso(valorOriginal, dataVencimentoStr) {
  const dataAtual = new Date();
  const dataVencimento = new Date(dataVencimentoStr);

  dataAtual.setHours(0, 0, 0, 0);
  dataVencimento.setHours(0, 0, 0, 0);

  const diferencaEmMs = dataAtual.getTime() - dataVencimento.getTime();
  const diasAtraso = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));

  if (diasAtraso <= 0) {
    return {
      status: "Em dia",
      diasAtraso: 0,
      valorOriginal,
      valorJuros: 0,
      valorTotal: valorOriginal
    };
  }

  const taxaDiaria = 0.025; // 2.5% ao dia
  const porcentagemTotalJuros = taxaDiaria * diasAtraso;
  const valorJuros = valorOriginal * porcentagemTotalJuros;
  const valorTotal = valorOriginal + valorJuros;

  return {
    status: "Vencido",
    diasAtraso,
    valorOriginal: valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    valorJuros: valorJuros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    valorTotal: valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  };
}