import { supabase } from '../supabaseClient';

export type Despesa = {
  id: number;
  periodo: string;
  data_vencimento: string | null;
  descricao: string;
  categoria: string | null;
  valor: number;
  pago: boolean;
  status: string | null;
  created_at: string;
};

export async function listDespesas(periodo?: string): Promise<Despesa[]> {
  let query = supabase.from('despesas').select('*').order('data_vencimento', { ascending: true });

  if (periodo) {
    query = query.eq('periodo', periodo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Despesa[];
}

export async function createDespesa(payload: Omit<Despesa, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('despesas').insert(payload);
  if (error) throw error;
}

export async function deleteDespesa(id: number): Promise<void> {
  const { error } = await supabase.from('despesas').delete().eq('id', id);
  if (error) throw error;
}
