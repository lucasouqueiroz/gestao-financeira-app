import { supabase } from '../supabaseClient';

export type Periodo = {
  id: number;
  ano: number;
  mes_numero: number;
  mes_nome: string;
  periodo: string;
  total_ganhos: number;
  total_despesas: number;
  balanco: number;
};

export async function listPeriodos(): Promise<Periodo[]> {
  const { data, error } = await supabase
    .from('periodos')
    .select('*')
    .order('periodo', { ascending: true });

  if (error) throw error;
  return data as Periodo[];
}
