import { listPeriodos } from '@/lib/finance/periods';
import { formatCurrencyBRL } from '@/lib/finance/format';

export default async function DashboardPage() {
  const periodos = await listPeriodos();
  const ultimoPeriodoComMovimento = [...periodos].reverse().find((p) => {
    return (p.total_ganhos ?? 0) !== 0 || (p.total_despesas ?? 0) !== 0 || (p.balanco ?? 0) !== 0;
  });

  return (
    <main className="space-y-4 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Gestão Financeira – Dashboard</h1>
          <p className="text-xs text-slate-400">
            Supabase + Next.js (períodos, despesas, ganhos).
          </p>
        </div>
      </header>

      {ultimoPeriodoComMovimento && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <h2 className="text-sm font-medium mb-2">Resumo mensal</h2>
            <p className="text-xs text-slate-400">
              Resumo de {ultimoPeriodoComMovimento.mes_nome} {ultimoPeriodoComMovimento.ano}
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <div>
                💰 Ganhos: <strong>{formatCurrencyBRL(ultimoPeriodoComMovimento.total_ganhos ?? 0)}</strong>
              </div>
              <div>
                🧾 Despesas: <strong>{formatCurrencyBRL(ultimoPeriodoComMovimento.total_despesas ?? 0)}</strong>
              </div>
              <div>
                {(ultimoPeriodoComMovimento.balanco ?? 0) < 0 ? '📉' : '📈'} Balanço:{' '}
                <span
                  className={(ultimoPeriodoComMovimento.balanco ?? 0) < 0 ? 'text-orange-400' : 'text-emerald-400'}
                >
                  {formatCurrencyBRL(ultimoPeriodoComMovimento.balanco ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <h2 className="text-sm font-medium mb-2">Lista de períodos</h2>
            <div className="max-h-64 overflow-y-auto mt-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-950">
                    <th className="px-2 py-1 text-left">Período</th>
                    <th className="px-2 py-1 text-right">Ganhos</th>
                    <th className="px-2 py-1 text-right">Despesas</th>
                    <th className="px-2 py-1 text-right">Balanço</th>
                  </tr>
                </thead>
                <tbody>
                  {periodos.map((p) => (
                    <tr key={p.id} className="odd:bg-slate-950 even:bg-slate-900">
                      <td className="px-2 py-1">{p.periodo}</td>
                      <td className="px-2 py-1 text-right">{formatCurrencyBRL(p.total_ganhos ?? 0)}</td>
                      <td className="px-2 py-1 text-right">{formatCurrencyBRL(p.total_despesas ?? 0)}</td>
                      <td className="px-2 py-1 text-right">{formatCurrencyBRL(p.balanco ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
