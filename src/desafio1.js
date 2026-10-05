export function processarComissoes(vendas) {
  const calcularComissaoPorVenda = (valor) => {
    if (valor < 100) return 0;
    if (valor < 500) return valor * 0.01;
    return valor * 0.05;
  };

  const relatorio = vendas.reduce((acc, { vendedor, valor }) => {
    const comissao = calcularComissaoPorVenda(valor);

    if (!acc[vendedor]) {
      acc[vendedor] = { totalVendas: 0, totalComissao: 0 };
    }

    acc[vendedor].totalVendas += valor;
    acc[vendedor].totalComissao += comissao;

    return acc;
  }, {});

  return Object.entries(relatorio).map(([vendedor, dados]) => ({
    Vendedor: vendedor,
    "Total de Vendas": dados.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    "Comissão Total": dados.totalComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }));
}