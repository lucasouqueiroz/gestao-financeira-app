import { supabase } from './src/lib/supabaseClient.js'

const $ = (selector) => document.querySelector(selector)

const authContainer = $('#auth-container')
const appContainer = $('#app')
const authForm = $('#auth-form')
const authEmail = $('#auth-email')
const authPassword = $('#auth-password')
const authName = $('#auth-nome')
const authNameField = $('#auth-nome-field')
const authStatus = $('#auth-status')
const authSubmit = $('#auth-submit')
const authToggle = $('#auth-toggle')
const mainContent = $('#main-content')
const modalOverlay = $('#modal-overlay')
const modalForm = $('#modal-form')
const modalTitle = $('#modal-title')

let mode = 'login'
let currentUser = null

function setStatus(message = '', isError = false) {
  authStatus.textContent = message
  authStatus.style.color = isError ? 'var(--danger)' : ''
}

function setEnabled(enabled) {
  authSubmit.disabled = !enabled
  authToggle.disabled = !enabled
}

function setMode(nextMode) {
  mode = nextMode
  const register = mode === 'register'
  authNameField.classList.toggle('hidden', !register)
  authName.required = register
  authPassword.autocomplete = register ? 'new-password' : 'current-password'
  authSubmit.textContent = register ? 'Criar conta' : 'Entrar'
  authToggle.textContent = register ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'
  setStatus(register ? 'Use uma senha com pelo menos 8 caracteres.' : '')
}

function showAuth() {
  appContainer.classList.add('hidden')
  authContainer.classList.remove('hidden')
  setEnabled(true)
}

function showApp() {
  authContainer.classList.add('hidden')
  appContainer.classList.remove('hidden')
  renderDashboard()
}

function currency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))
}

async function renderDashboard() {
  mainContent.innerHTML = '<div class="page-header"><h1 class="page-title">Carregando sua visão geral…</h1></div>'
  const { data, error } = await supabase
    .from('transacoes')
    .select('id, tipo, descricao, valor, vencimento, status')
    .order('vencimento', { ascending: false })

  if (error) {
    mainContent.innerHTML = `<div class="card"><h1 class="page-title">Não foi possível carregar os dados</h1><p>${error.message}</p></div>`
    return
  }

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const items = data || []
  const monthItems = items.filter((item) => {
    const date = new Date(`${item.vencimento}T12:00:00`)
    return date.getFullYear() === year && date.getMonth() + 1 === month
  })
  const ganhos = monthItems.filter((item) => item.tipo === 'Ganho').reduce((sum, item) => sum + Number(item.valor), 0)
  const despesas = monthItems.filter((item) => item.tipo === 'Despesa').reduce((sum, item) => sum + Number(item.valor), 0)
  const pendentes = monthItems.filter((item) => item.status === 'PENDENTE').length

  mainContent.innerHTML = `
    <header class="page-header animate-fade-in">
      <h1 class="page-title">Olá, ${currentUser?.user_metadata?.nome || currentUser?.email?.split('@')[0] || 'você'}</h1>
      <p class="page-subtitle">Uma visão simples e privada da sua vida financeira.</p>
    </header>
    <section class="dashboard-grid">
      <article class="card stat-card ganho"><span class="stat-label">Entradas do mês</span><strong class="stat-value" style="color:var(--success)">${currency(ganhos)}</strong><span class="stat-change positive">Receitas registradas</span></article>
      <article class="card stat-card despesa"><span class="stat-label">Saídas do mês</span><strong class="stat-value" style="color:var(--danger)">${currency(despesas)}</strong><span class="stat-change negative">Despesas registradas</span></article>
      <article class="card stat-card"><span class="stat-label">Saldo do mês</span><strong class="stat-value">${currency(ganhos - despesas)}</strong><span class="stat-change ${ganhos >= despesas ? 'positive' : 'negative'}">${ganhos >= despesas ? 'Em equilíbrio' : 'Atenção ao saldo'}</span></article>
      <article class="card stat-card"><span class="stat-label">Pendências</span><strong class="stat-value">${pendentes}</strong><span class="stat-change">Lançamentos abertos</span></article>
    </section>
    <section class="card animate-slide-up">
      <div class="card-header"><div><h2 class="card-title">Últimos lançamentos</h2><p class="text-muted text-sm">Somente você pode visualizar estes dados.</p></div><button id="open-new" type="button" class="btn btn-primary">Novo lançamento</button></div>
      <div class="table-container"><table class="table"><thead><tr><th>Descrição</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>${items.slice(0, 6).map((item) => `<tr><td>${escape(item.descricao)}</td><td>${new Date(`${item.vencimento}T12:00:00`).toLocaleDateString('pt-BR')}</td><td style="font-weight:700;color:${item.tipo === 'Ganho' ? 'var(--success)' : 'var(--danger)'}">${item.tipo === 'Ganho' ? '+' : '−'} ${currency(item.valor)}</td><td><span class="badge badge-${item.status === 'PAGO' ? 'pago' : 'pendente'}">${item.status === 'PAGO' ? 'Pago' : 'Pendente'}</span></td></tr>`).join('') || '<tr><td colspan="4" class="text-muted">Nenhum lançamento ainda.</td></tr>'}</tbody></table></div>
    </section>`

  $('#open-new')?.addEventListener('click', openNewTransaction)
}

function escape(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]))
}

async function submitAuth(event) {
  event.preventDefault()
  const email = authEmail.value.trim()
  const password = authPassword.value
  const nome = authName.value.trim()

  if (!email || !password || (mode === 'register' && !nome)) return

  setEnabled(false)
  setStatus(mode === 'login' ? 'Entrando…' : 'Criando conta…')
  try {
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
          emailRedirectTo: 'https://lucasouqueiroz.github.io/gestao-financeira-app/'
        }
      })
      if (error) throw error
      if (!data.session) {
        setMode('login')
        setStatus('Conta criada. Confirme o seu e-mail e depois entre.')
      }
    }
  } catch (error) {
    setStatus(error.message || 'Não foi possível concluir a autenticação.', true)
  } finally {
    setEnabled(true)
  }
}

function openNewTransaction() {
  modalTitle.textContent = 'Novo lançamento'
  modalForm.innerHTML = `
    <div class="form-group"><label class="form-label" for="descricao">Descrição</label><input id="descricao" name="descricao" class="form-input" maxlength="140" required placeholder="Ex.: Mercado"></div>
    <div class="form-group"><label class="form-label" for="tipo">Tipo</label><select id="tipo" name="tipo" class="form-select"><option value="Despesa">Despesa</option><option value="Ganho">Ganho</option></select></div>
    <div class="form-group"><label class="form-label" for="valor">Valor</label><input id="valor" name="valor" type="number" min="0.01" step="0.01" required class="form-input" placeholder="0,00"></div>
    <div class="form-group"><label class="form-label" for="vencimento">Data</label><input id="vencimento" name="vencimento" type="date" required class="form-input" value="${new Date().toISOString().slice(0, 10)}"></div>
    <div class="form-group"><label class="form-label" for="status">Status</label><select id="status" name="status" class="form-select"><option value="PENDENTE">Pendente</option><option value="PAGO">Pago</option></select></div>
    <div class="flex gap-4 mt-6"><button id="modal-cancel" type="button" class="btn btn-secondary" style="flex:1">Cancelar</button><button type="submit" class="btn btn-primary" style="flex:1">Salvar</button></div>`
  modalOverlay.classList.add('active')
  $('#modal-cancel').addEventListener('click', closeModal)
}

function closeModal() {
  modalOverlay.classList.remove('active')
  modalForm.innerHTML = ''
}

async function saveTransaction(event) {
  event.preventDefault()
  const values = Object.fromEntries(new FormData(modalForm))
  const date = new Date(`${values.vencimento}T12:00:00`)
  const { error } = await supabase.from('transacoes').insert({
    descricao: values.descricao.trim(), tipo: values.tipo, valor: Number(values.valor), vencimento: values.vencimento,
    status: values.status, pago: values.status === 'PAGO', ano: date.getFullYear(), mes: date.getMonth() + 1,
    usuario_id: currentUser.id
  })
  if (error) throw error
  closeModal()
  await renderDashboard()
}

async function start() {
  authForm.addEventListener('submit', submitAuth)
  authToggle.addEventListener('click', () => setMode(mode === 'login' ? 'register' : 'login'))
  $('#btn-logout').addEventListener('click', () => supabase.auth.signOut())
  $('#nav-dashboard').addEventListener('click', renderDashboard)
  $('#nav-transacoes').addEventListener('click', renderDashboard)
  $('#nav-novo').addEventListener('click', openNewTransaction)
  $('#modal-close').addEventListener('click', closeModal)
  modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal() })
  modalForm.addEventListener('submit', async (event) => { try { await saveTransaction(event) } catch (error) { alert(error.message || 'Não foi possível salvar o lançamento.') } })

  const { data: { session } } = await supabase.auth.getSession()
  currentUser = session?.user || null
  if (currentUser) showApp()
  else { showAuth(); setStatus('') }

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null
    if (currentUser) showApp()
    else showAuth()
  })
}

start().catch((error) => { showAuth(); setStatus(error.message || 'Falha ao iniciar a autenticação.', true); setEnabled(true) })
