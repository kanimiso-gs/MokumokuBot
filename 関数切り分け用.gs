/**
 * 入力メッセージの状態を判定するための関数
 * 
 * @return {sring} status - 「開始」または「終了」
 */
function getMessageStatus() {
  const inputedMassageStart = 'もくもく開始';
  const inputedMassageEnd = 'もくもく終了';

  const json = JSON.parse(e.postData.contents);
  const inputBody = json.webhook_event.body;
  console.log('inputBody', inputBody);

  //受け取ったメッセージにで開始か終了か判定
  let status;
  
  const isStartMessage = inputBody.includes(inputedMassageStart);
  const isEndMessage = inputBody.includes(inputedMassageEnd);

  //開始でも終了でもない時は何もしない
  if (!isStartMessage && !isEndMessage) return;

  if(isStartMessage) {
    // 始まりの処理を書く
    status = '開始';
    console.log('もくもく開始です');
  }

  if(isEndMessage) {
    // 終わりの処理を書く
    status = '終了';
    console.log('もくもく終了です');
  }

  return status;
}