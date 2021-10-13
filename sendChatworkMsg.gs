//参考：https://tonari-it.com/gas-chatwork-webhook-message/#i-6
/***********************************************
*注意点  ||アプリケーションとして公開しています
*       ||コードを更新したら、Newで公開し直してください
*sammary||チャットワークルームに「もくもく開始」と送信すると開始時メッセージが返ります
*sammary||チャットワークルームに「もくもく終了」と送信すると終了時メッセージが返ります
***********************************************/
function doPost(e) {

  const CW_TOKEN = PropertiesService.getScriptProperties().getProperty("CW_TOKEN");//チャットワークAPIトークン
  const inputedMassageStart = 'もくもく開始';
  const inputedMassageEnd = 'もくもく終了';

  const json = JSON.parse(e.postData.contents);
  const inputBody = json.webhook_event.body;
  console.log('inputBody', inputBody);

  //受け取ったメッセージにで開始か終了か判定
  let status;
  if (inputBody.indexOf(inputedMassageStart) === -1) {

    if (inputBody.indexOf(inputedMassageEnd) === -1) return;//開始でも終了でもないので何もしない
    status = '終了';
    console.log('もくもく終了です');

  } else {

    status = '開始';
    console.log('もくもく開始です');

  }

  //受け取ったメッセージの情報
  const accountId = json.webhook_event.account_id;
  const fullName = getFullName(accountId);
  const entryNum = getEntryNum(accountId);

  let lastEntryDate;
  if (getLastEntryDate(accountId) === 'はじめての参加') {

    lastEntryDate = '、記念すべきはじめて'

  } else {

    lastEntryDate = formatDate(new Date(getLastEntryDate(accountId)), 'YYYY年MM月DD日') + 'ぶり、' + entryNum + '回目';

  }

  //spにlogを出力
  setLog(accountId, fullName, status);

  const msgSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('msg');
  const arrMsgData = msgSheet.getDataRange().getValues().shift();//[0][1]startMsg,[1][1]endMsg

  let msgBody = '';
  const memberNum = countMemberNum();

  if (status === '開始') {

    msgBody += `${fullName}さんは${lastEntryDate}の参加です(cracker)
もくもくがんばってください！
現在の参加者は${memberNum}人です。`

  } else {

    msgBody += `もくもく、おつかれさまでした！(cracker)
現在の参加者は、${memberNum}人です。`

  }

  const params = {
    headers: { "X-ChatWorkToken": CW_TOKEN },
    method: "post"
  };

  params.payload = { body: msgBody };
  const roomId = json.webhook_event.room_id;
  UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", params);

}




function getFullName(accountId) {

  const arrCwData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('cw').getDataRange().getValues();
  const targetValues = generateArray_(arrCwData, 0);//★範囲注意
  const dateRowIndex = targetValues.indexOf(accountId);
  return arrCwData[dateRowIndex][1];

}


function countMemberNum() {

  const arrLog = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log').getDataRange().getValues();
  const targetValues = generateArray_(arrLog, 3);//★範囲注意
  return (targetValues.filter(function (x) { return x === '開始' }).length - targetValues.filter(function (x) { return x === '終了' }).length);

}


function getLastEntryDate(accountId) {

  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log');
  const arrLog = logSheet.getDataRange().getValues();
  const lastRow = logSheet.getRange('a:a').getValues().filter(String).length;
  const targetValues = generateArray_(arrLog, 0);//★範囲注意
  const dateRowIndex = targetValues.lastIndexOf(accountId) + 1;

  if (dateRowIndex === 0) {

    return 'はじめての参加';

  }

  return logSheet.getRange(dateRowIndex, 3).getValue();

}


function getEntryNum(accountId) {

  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log');
  const arrLog = logSheet.getDataRange().getValues();
  const targetValues = generateArray_(arrLog, 4);//★範囲注意
  return targetValues.filter(function (x) { return x === accountId + '開始' }).length + 1;

}


function setLog(accountId, fullName, startBool) {

  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log');
  const lastRow = logSheet.getRange('a:a').getValues().filter(String).length;
  const data = [[accountId, fullName, new Date(), startBool]];
  logSheet.getRange(lastRow + 1, 1, 1, data[0].length).setValues(data);

}