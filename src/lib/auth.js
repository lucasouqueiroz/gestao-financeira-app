import { supabase } from './supabaseClient'

// Estado da sessao
let currentUser = null
let currentSession = null

// Callbacks para atualizacao de UI
let authListeners = []

// Inicializar auth
export async function initAuth() {
  // Recuperar sessao existente
  const { data: { session } } = await supabase.auth.getSession()
  currentSession = session
  currentUser = session?.user ?? null
  
  // Notificar listeners
  notifyAuthListeners()
  
  // Listen para mudancas de auth
  supabase.auth.onAuthStateChange((event, session) => {
    currentSession = session
    currentUser = session?.user ?? null
    notifyAuthListeners()
  })
  
  return { user: currentUser, session: currentSession }
}

// Registrar listener
export function onAuthChange(callback) {
  authListeners.push(callback)
  // Chamar imediatamente com estado atual
  callback({ user: currentUser, session: currentSession })
}

// Notificar todos os listeners
function notifyAuthListeners() {
  authListeners.forEach(cb => cb({ user: currentUser, session: currentSession }))
}

// Login com email/senha
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Registro com email/senha
export async function signUp(email, password, nome) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome
      }
    }
  })
  
  if (error) throw error
  return data
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  currentUser = null
  currentSession = null
  notifyAuthListeners()
}

// Recuperar senha
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  })
  if (error) throw error
}

// Verificar se esta autenticado
export function isAuthenticated() {
  return currentUser !== null
}

// Obter usuario atual
export function getCurrentUser() {
  return currentUser
}

// Obter token
export async function getToken() {
  if (!currentSession) return null
  return currentSession.access_token
}
