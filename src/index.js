import express from 'express';
import cors from 'cors';
import { processarComissoes } from './desafio1.js';
import { GerenciadorEstoque } from './desafio2.js';
import { calcularJurosAtraso } from './desafio3.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dados simulados
const dadosVendas = [
  { vendedor: "João Silva", valor: 1200.50 },
  { vendedor: "João Silva", valor: 950.75 },
  { vendedor: "João Silva", valor: 1800.00 },
  { vendedor: "João Silva", valor: 250.30 },
  { vendedor: "Maria Souza", valor: 2100.40 },
  { vendedor: "Maria Souza", valor: 1350.60 },
  { vendedor: "Maria Souza", valor: 90.75 },
  { vendedor: "Carlos Oliveira", valor: 800.50 },
  { vendedor: "Carlos Oliveira", valor: 1200.00 },
  { vendedor: "Ana Lima", valor: 1000.00 },
  { vendedor: "Ana Lima", valor: 420.90 }
];

const produtosIniciais = [
  { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 },
  { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
  { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
  { codigoProduto: 105, descricaoProduto: "Marcador de Texto Amarelo", estoque: 90 }
];

const estoqueManager = new GerenciadorEstoque(produtosIniciais);

// -------------------------------------------------------------
// PÁGINA ÚNICA COM NAVEGAÇÃO POR ABAS/BOTÕES
// -------------------------------------------------------------
app.get('/', (_req, res) => {
  const comissoes = processarComissoes(dadosVendas);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Painel de Desafios Técnicos</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { font-size: 1.8rem; margin-bottom: 20px; color: #0f172a; }
        
        /* Botões de Navegação (Abas) */
        .nav-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .tab-btn { background: #e2e8f0; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #475569; }
        .tab-btn.active { background: #2563eb; color: white; }
        .tab-btn:hover:not(.active) { background: #cbd5e1; }

        /* Conteúdo das Abas */
        .tab-content { display: none; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .tab-content.active { display: block; }

        /* Tabelas */
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.9rem; }

        /* Formulários e Inputs */
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 0.9rem; }
        input, select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; }
        button.btn-submit { background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 10px; }
        button.btn-submit:hover { background: #15803d; }
        
        .result-box { margin-top: 15px; padding: 15px; border-radius: 6px; background: #f1f5f9; display: none; }
      </style>
    </head>
    <body>

      <div class="container">
        <h1>📊 Painel de Desafios Técnicos</h1>

        <!-- Botões de Troca de Tela -->
        <div class="nav-tabs">
          <button class="tab-btn active" onclick="openTab('comissoes')">1. Comissões</button>
          <button class="tab-btn" onclick="openTab('estoque')">2. Controle de Estoque</button>
          <button class="tab-btn" onclick="openTab('juros')">3. Cálculo de Juros</button>
        </div>

        <!-- ABA 1: COMISSÕES -->
        <div id="comissoes" class="tab-content active">
          <h2>Relatório de Comissões por Vendedor</h2>
          <table>
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Total em Vendas</th>
                <th>Comissão Calculada</th>
              </tr>
            </thead>
            <tbody>
              ${comissoes.map(item => `
                <tr>
                  <td><strong>${item.Vendedor}</strong></td>
                  <td>${item["Total de Vendas"]}</td>
                  <td><span class="badge">${item["Comissão Total"]}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ABA 2: ESTOQUE -->
        <div id="estoque" class="tab-content">
          <h2>Movimentação de Estoque</h2>
          <form id="formEstoque" onsubmit="lancarMovimentacao(event)" style="margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="form-group">
                <label>Produto</label>
                <select id="codigoProduto">
                  ${estoqueManager.produtos.map(p => `
                    <option value="${p.codigoProduto}">${p.descricaoProduto} (Atual: ${p.estoque} un)</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Tipo de Operação</label>
                <select id="tipoOperacao">
                  <option value="ENTRADA">ENTRADA (+)</option>
                  <option value="SAIDA">SAÍDA (-)</option>
                </select>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
              <div class="form-group">
                <label>Quantidade</label>
                <input type="number" id="qtdEstoque" min="1" required value="10">
              </div>
              <div class="form-group">
                <label>Descrição/Motivo</label>
                <input type="text" id="descEstoque" placeholder="Ex: Compra de fornecedor" required value="Ajuste manual">
              </div>
            </div>
            <button type="submit" class="btn-submit">Registrar Movimentação</button>
          </form>

          <h3>Estoque Atual</h3>
          <table id="tabelaEstoque">
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Estoque Atual</th>
              </tr>
            </thead>
            <tbody>
              ${estoqueManager.produtos.map(p => `
                <tr>
                  <td><code>${p.codigoProduto}</code></td>
                  <td>${p.descricaoProduto}</td>
                  <td><strong>${p.estoque} un.</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ABA 3: JUROS -->
        <div id="juros" class="tab-content">
          <h2>Cálculo de Juros Diários (2.5% ao dia)</h2>
          <form id="formJuros" onsubmit="calcularJurosForm(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="form-group">
                <label>Valor da Parcela (R$)</label>
                <input type="number" id="valorJuros" step="0.01" value="1000.00" required>
              </div>
              <div class="form-group">
                <label>Data de Vencimento</label>
                <input type="date" id="dataVencimento" value="2026-09-25" required>
              </div>
            </div>
            <button type="submit" class="btn-submit" style="background: #2563eb;">Calcular Valor Atualizado</button>
          </form>

          <div id="resultadoJuros" class="result-box"></div>
        </div>
      </div>

      <!-- LÓGICA DO FRONTEND (JavaScript nativo no navegador) -->
      <script>
        function openTab(tabName) {
          document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
          document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
          
          document.getElementById(tabName).classList.add('active');
          event.currentTarget.classList.add('active');
        }

        async function lancarMovimentacao(e) {
          e.preventDefault();
          const body = {
            codigoProduto: Number(document.getElementById('codigoProduto').value),
            tipo: document.getElementById('tipoOperacao').value,
            quantidade: Number(document.getElementById('qtdEstoque').value),
            descricao: document.getElementById('descEstoque').value
          };

          const res = await fetch('/api/estoque/movimentar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          const data = await res.json();
          if (res.ok) {
            alert('Movimentação id ' + data.resultado.id + ' realizada!');
            window.location.reload();
          } else {
            alert('Erro: ' + data.error);
          }
        }

        async function calcularJurosForm(e) {
          e.preventDefault();
          const valor = document.getElementById('valorJuros').value;
          const vencimento = document.getElementById('dataVencimento').value;

          const res = await fetch(\`/api/juros?valor=\${valor}&vencimento=\${vencimento}\`);
          const data = await res.json();

          const resultDiv = document.getElementById('resultadoJuros');
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = \`
            <h4>Resultado do Cálculo:</h4>
            <p><strong>Status:</strong> \${data.status}</p>
            <p><strong>Dias em Atraso:</strong> \${data.diasAtraso} dia(s)</p>
            <p><strong>Valor Original:</strong> \${data.valorOriginal}</p>
            <p><strong>Juros Acumulados:</strong> \${data.valorJuros}</p>
            <p style="font-size: 1.1rem; color: #dc2626; margin-top: 5px;"><strong>Total a Pagar: \${data.valorTotal}</strong></p>
          \`;
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// -------------------------------------------------------------
// ENDPOINTS JSON MANTIDOS
// -------------------------------------------------------------
app.get('/api/comissoes', (_req, res) => {
  res.json(processarComissoes(dadosVendas));
});

app.post('/api/estoque/movimentar', (req, res) => {
  try {
    const { codigoProduto, tipo, quantidade, descricao } = req.body;
    const resultado = estoqueManager.movimentar({ codigoProduto, tipo, quantidade, descricao });
    res.json({ mensagem: "Movimentação realizada!", resultado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/juros', (req, res) => {
  const valor = parseFloat(req.query.valor || 1000);
  const vencimento = req.query.vencimento || '2026-09-25';
  res.json(calcularJurosAtraso(valor, vencimento));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor com interface rodando em: http://localhost:${PORT}\n`);
});