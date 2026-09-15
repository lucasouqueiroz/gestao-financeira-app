function doGet(e) {
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('Gestão Financeira')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
