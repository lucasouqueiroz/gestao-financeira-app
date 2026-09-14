export const CATEGORIAS = [
  "Cartão de Crédito",
  "Moradia/Utilidades",
  "Telefonia/Internet Móvel",
  "Educação",
  "Dívidas/Empréstimos",
  "Compras Parceladas",
  "Transporte",
  "Cuidados Pessoais",
  "Receita",
  "Outros"
];

export const CORES = {
  "Cartão de Crédito": "#ef4444",
  "Moradia/Utilidades": "#f59e0b",
  "Telefonia/Internet Móvel": "#3b82f6",
  "Educação": "#8b5cf6",
  "Dívidas/Empréstimos": "#ec4899",
  "Compras Parceladas": "#14b8a6",
  "Transporte": "#f97316",
  "Cuidados Pessoais": "#a3a3a3",
  "Receita": "#22c55e",
  "Outros": "#64748b"
};

export function classificar(descricao) {
  const d = descricao.toUpperCase();
  if (d.includes("CARTÃO") || d.includes("PICPAY PARCELA")) return "Cartão de Crédito";
  if (d.includes("LUZ") || d.includes("INTERNET FIXA") || d.includes("LIMPEZA")) return "Moradia/Utilidades";
  if (d.includes("INTERNET MÓVEL") || d.includes("CLARO")) return "Telefonia/Internet Móvel";
  if (d.includes("GRADUAÇÃO") || d.includes("FACULDADE") || d.includes("CURSO")) return "Educação";
  if (d.includes("EMPRÉSTIMO")) return "Dívidas/Empréstimos";
  if (d.includes("PARCELA")) return "Compras Parceladas";
  if (d.includes("TRANSPORTE") || d.includes("MULTA") || d.includes("UBER")) return "Transporte";
  if (d.includes("CABELO") || d.includes("BARBEARIA") || d.includes("SALÃO")) return "Cuidados Pessoais";
  if (d.includes("PAGAMENTO") || d.includes("SALÁRIO") || d.includes("RECEBIMENTO")) return "Receita";
  return "Outros";
}

export function interpretarTexto(texto) {
  const valorMatch = texto.match(/(\d+[.,]?\d*)/);
  const valor = valorMatch ? parseFloat(valorMatch[1].replace(',', '.')) : 0;
  const isGanho = /receb|ganho|pagamento de|entrada/i.test(texto) && !/cartão|conta|internet/i.test(texto);
  const descricao = texto.replace(/paguei|recebi|gastei|de r\$|r\$/gi, '').trim().toUpperCase() || "NOVO LANÇAMENTO";
  const categoria = isGanho ? "Receita" : classificar(descricao);
  return {
    tipo: isGanho ? "Ganho" : "Despesa",
    descricao,
    valor,
    categoria
  };
}

export function fmt(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
