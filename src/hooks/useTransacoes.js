import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: cats, error: catErr }, { data: trans, error: transErr }] = await Promise.all([
        supabase.from('categorias').select('*'),
        supabase.from('transacoes').select('*, categorias(nome, cor)').order('vencimento', { ascending: false })
      ]);
      if (catErr) throw catErr;
      if (transErr) throw transErr;
      setCategorias(cats || []);
      setTransacoes((trans || []).map(t => ({
        ...t,
        categoria_nome: t.categorias?.nome || 'Outros',
        categoria_cor: t.categorias?.cor || '#64748b'
      })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const adicionarTransacao = useCallback(async (novo) => {
    const categoria = categorias.find(c => c.nome === novo.categoria);
    const { error: insertErr } = await supabase.from('transacoes').insert({
      tipo: novo.tipo,
      categoria_id: categoria?.id || null,
      descricao: novo.descricao,
      valor: novo.valor,
      ano: novo.ano,
      mes: novo.mes,
      vencimento: novo.vencimento,
      pago: novo.pago,
      status: novo.status
    });
    if (insertErr) throw insertErr;
    await carregar();
  }, [categorias, carregar]);

  const atualizarStatus = useCallback(async (id, pago) => {
    const { error: updateErr } = await supabase
      .from('transacoes')
      .update({ pago, status: pago ? 'PAGO' : 'PENDENTE', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (updateErr) throw updateErr;
    await carregar();
  }, [carregar]);

  return { transacoes, categorias, loading, error, recarregar: carregar, adicionarTransacao, atualizarStatus };
}
