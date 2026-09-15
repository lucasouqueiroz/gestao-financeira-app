const SUPABASE_URL = window.__SUPABASE_URL__ || '';
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__ || '';

let resumoData = [];
let despesasData = [];
let chart;

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
const normalize = value => String(value ?? '').trim().toUpperCase();

function showApp() {
  document.querySelectorAll('[data-auth], #login, #auth, .login-screen, .auth-screen').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-app], #app, #dashboard, .app-screen, .dashboard-screen').forEach(el => {
    el.style.display = '';
  });
  document.body.classList.add('app-unlocked');
}

function parseMoney(value) {
  if (typeof value === 'number') return value;
  const text = String(value ?? '').replace(/R\$/gi, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function renderSummary(rows) {
  const ganhos = rows.reduce((total, row) => total + parseMoney(row.TOTALGANHOS ?? row.totalganhos), 0);
  const despesas = rows.reduce((total, row) => total + parseMoney(row.TOTALDESPESAS ?? row.totaldespesas), 0);
  const saldo = rows.reduce((total, row) => total + parseMoney(row.BALANÇO ?? row.BALANCO ?? row.balanco), 0);
  const map = {
    ganhos: ganhos,
    totalGanhos: ganhos,
    despesas: despesas,
    totalDespesas: despesas,
    saldo: saldo,
    balanco: saldo
  };
  Object.entries(map).forEach(([key, value]) => {
    document.querySelectorAll(`[data-metric="${key}"]`).forEach(el => el.textContent = money(value));
  });
}

function renderExpenses(rows) {
  const pending = rows.filter(row => {
    const status = normalize(row.STATUS ?? row.status);
    const paid = row.PAGO === true || normalize(row.PAGO ?? row.pago) === 'TRUE' || status === 'PAGO';
    return !paid;
  });
  document.querySelectorAll('[data-expenses-count]').forEach(el => el.textContent = pending.length);
  document.querySelectorAll('[data-expenses-list]').forEach(container => {
    container.innerHTML = pending.slice(0, 20).map(row => `
      <div class="expense-row">
        <span>${row.DESCRIÇÃO ?? row.descricao ?? ''}</span>
        <strong>${money(parseMoney(row.VALOR ?? row.valor))}</strong>
      </div>
    `).join('') || '<p>Nenhuma despesa pendente.</p>';
  });
}

function renderDashboard() {
  showApp();
  renderSummary(resumoData);
  renderExpenses(despesasData);
}

async function loadSupabaseData() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  try {
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
    const [summaryResponse, expensesResponse] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/resumo?select=*`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/despesas?select=*`, { headers })
    ]);
    if (!summaryResponse.ok || !expensesResponse.ok) return false;
    resumoData = await summaryResponse.json();
    despesasData = await expensesResponse.json();
    renderDashboard();
    return true;
  } catch (error) {
    console.warn('Supabase indisponível; mantendo dashboard público.', error);
    return false;
  }
}

function bindImport() {
  const input = document.querySelector('input[type="file"]');
  if (!input || typeof XLSX === 'undefined') return;
  input.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const summarySheet = workbook.Sheets.RESUMO || workbook.Sheets['VISÃO GERAL'] || workbook.Sheets['Visao Geral'];
        const expensesSheet = workbook.Sheets.DESPESAS;
        if (summarySheet) resumoData = XLSX.utils.sheet_to_json(summarySheet, { defval: '' });
        if (expensesSheet) despesasData = XLSX.utils.sheet_to_json(expensesSheet, { defval: '' });
        renderDashboard();
      } catch (error) {
        console.error('Erro ao importar planilha:', error);
        alert('Não foi possível ler a planilha. Verifique se ela possui as abas RESUMO e DESPESAS.');
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  showApp();
  bindImport();
  await loadSupabaseData();
});
