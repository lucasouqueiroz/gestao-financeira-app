import { supabase } from '../supabaseClient';

export type Ganho = {
  id: number;
  periodo: string;
  data_recebimento: string | null;
  descricao: string;
  categoria: string | null;
  valor: number;
  pago: boolean;
  status: string | null;
  created_at: string;
};

export async function listGanhos(periodo?: string): Promise<Ganho[]> {
  let query = supabase.from('ganhos').select('*').order('data_recebimento', { ascending: true });

  if (periodo) {
    query = query.eq('periodo', periodo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Ganho[];
}

export async function createGanho(payload: Omit<Ganho, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('ganhos').insert(payload);
  if (error) throw error;
}

export async function deleteGanho(id: number): Promise<void> {
  const { error } = await supabase.from('ganhos').delete().eq('id', id);
  if (error) throw error;
}
