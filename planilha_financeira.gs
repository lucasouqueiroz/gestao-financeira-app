function getSheet(nomeAba) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(nomeAba);
  if (!sheet) {
    throw new Error('Aba não encontrada: ' + nomeAba);
  }
  return sheet;
}

function getDataRangeValues(nomeAba) {
  const sheet = getSheet(nomeAba);
  return sheet.getDataRange().getValues();
}
