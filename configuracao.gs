// Nome das abas na planilha de Gestão Financeira
const ABA_BALANCO_MENSAL = 'balanco_mensal';
const ABA_DESPESAS = 'despesas';
const ABA_GANHOS = 'ganhos';

// Se o projeto estiver vinculado à planilha, usamos getActiveSpreadsheet.
// Se quiser trabalhar com ID fixo, troque para openById('SEU_ID').
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}
