import { randomUUID } from 'node:crypto';

export class GerenciadorEstoque {
  constructor(produtos) {
    this.produtos = produtos;
    this.historico = [];
  }

  movimentar({ codigoProduto, tipo, quantidade, descricao }) {
    const produto = this.produtos.find(p => p.codigoProduto === codigoProduto);

    if (!produto) {
      throw new Error(`Produto com código ${codigoProduto} não encontrado.`);
    }

    if (tipo === 'SAIDA' && produto.estoque < quantidade) {
      throw new Error(`Estoque insuficiente para ${produto.descricaoProduto}. Estoque atual: ${produto.estoque}`);
    }

    if (tipo === 'ENTRADA') produto.estoque += quantidade;
    if (tipo === 'SAIDA') produto.estoque -= quantidade;

    const movimentacao = {
      id: randomUUID(),
      codigoProduto,
      descricaoProduto: produto.descricaoProduto,
      tipo,
      quantidade,
      descricao,
      dataHora: new Date().toISOString(),
      estoqueResultante: produto.estoque
    };

    this.historico.push(movimentacao);

    return movimentacao;
  }
}