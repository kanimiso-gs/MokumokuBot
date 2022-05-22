/*
*Summary ：空白行をすべて省いた上で、1次元配列を生成する。
*argument: values（配列）・column（1次元配列にしたい列のインデックス番号：0～）
*参考URL  ：https://note.com/nepia_infinity/n/n2356ffbe65dd
*/
function generateArray1_(values, column) {
  return values.map(record => record[column]).filter(value => value);
}

/*
*Summary : Dataオブジェクトをformatの形に変換して返す
*argument: date（Dataオブジェクト）・format（変換したい形・例：YYYY年MM月DD日）
*/
function formatDate(date, format) {
  format = format.replace(/YYYY/, date.getFullYear());
  let month = date.getMonth() + 1;
  month = month + '';//length使うために文字列に変換
  //一桁の月だったら「0」を先頭に追加（1月なら01に）
  if (month.length == 1) {
    month = '0' + month;
  }
  format = format.replace(/MM/, month);
  format = format.replace(/DD/, date.getDate());
  return format;
}