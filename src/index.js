import { processarComissoes } from './desafio1.js';
import { GerenciadorEstoque } from './desafio2.js';
import { calcularJurosAtraso } from './desafio3.js';

console.log("=== 1. DESAFIO DE COMISSÃO DE VENDAS ===");
const dadosVendas = [
  { vendedor: "João Silva", valor: 1200.50 },
  { vendedor: "João Silva", valor: 250.30 },
  { vendedor: "Maria Souza", valor: 2100.40 },
  { vendedor: "Maria Souza", valor: 90.75 },
  { vendedor: "Carlos Oliveira", valor: 800.50 },
  { vendedor: "Ana Lima", valor: 1000.00 }
];
console.table(processarComissoes(dadosVendas));

console.log("\n=== 2. DESAFIO DE MOVIMENTAÇÃO DE ESTOQUE ===");
const produtos = [
  { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 }
];
const estoque = new GerenciadorEstoque(produtos);
const mov1 = estoque.movimentar({ codigoProduto: 101, tipo: 'ENTRADA', quantidade: 50, descricao: 'Recebimento fornecedor' });
console.log("Movimentação realizada:", mov1);

console.log("\n=== 3. DESAFIO DE CÁLCULO DE JUROS ===");
const resultadoJuros = calcularJurosAtraso(1000.00, '2026-09-25');
console.log(resultadoJuros);