//TOKENを変更する時に実行
function setProperty() {
  PropertiesService.getScriptProperties().setProperty('CW_TOKEN', 'XXXXXX');
}

//TOKENを確認する時に実行
function getProperty() {
  console.log('CW_TOKEN', PropertiesService.getScriptProperties().getProperty('CW_TOKEN'));
}