function doPostTest() {

  const inputedMassageStart = 'もくもく開始';
  const testInputMessage = `もくもく開始。あしたの準備`;
  const testInputMessage_false = `もくもく開。あしたの準備`;

  console.log(testInputMessage.match(inputedMassageStart));
  console.log(testInputMessage_false.includes(inputedMassageStart));
  countCurrentMenbers_();

  return;
}
