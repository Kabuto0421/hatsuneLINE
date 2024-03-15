
function preload() {
  img = loadImage("hatsunemiku.jpg"); // 画像のパスを指定
}

const { Player, Ease } = TextAliveApp;

const player = new Player({
  app: {
    appAuthor: "Jun Kato",
    appName: "Basic example"
  },
  mediaElement: document.querySelector("#media")
});

player.addListener({
  onAppReady,
  onTimerReady,
  onTimeUpdate,
  onThrottledTimeUpdate
});

const playBtn = document.querySelector("#play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#container p");
const beatbarEl = document.querySelector("#beatbar");

function onAppReady(app) {
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";
    playBtn.addEventListener("click", () => player.video && player.requestPlay());
    jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
    pauseBtn.addEventListener("click", () => player.video && player.requestPause());
    rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
  }
  if (!app.songUrl) {
    player.createFromSongUrl("https://www.youtube.com/watch?v=-2KzcaiyBFo");
  }
}

function onTimerReady() {
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  document
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));

  let p = player.video.firstPhrase;
  jumpBtn.disabled = !p;

  // set `animate` method
  while (p && p.next) {
    p.animate = animatePhrase;
    p = p.next;
  }
}

function onTimeUpdate(position) {

  // show beatbar
  const beat = player.findBeat(position);
  if (!beat) {
    return;
  }
  beatbarEl.style.width = `${Math.ceil(Ease.circIn(beat.progress(position)) * 100)}%`;
}

function onThrottledTimeUpdate(position) {
  positionEl.textContent = String(Math.floor(position));
}

let currentPhrase = ""; // 現在のフレーズを格納する変数
let messages = []; // メッセージを格納する配列
function animatePhrase(now, unit) {
  // フレーズが更新されたタイミングでのみ動作
  if (unit.contains(now) && currentPhrase !== unit.text) {
    // 現在のフレーズを更新
    currentPhrase = unit.text;

    // 新しいフレーズをmessages配列に追加
    messages.push({ text: unit.text, time: now });
  }
}

let scene = 0;
let btnX, btnY, btnWidth, btnHeight; // ボタンの位置とサイズ
let img; // 画像を格納する変数


function setup() {

  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  updateButtonSize(); // ボタンのサイズと位置を更新
  document.getElementById('content').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';

}

function draw() {
  switch (scene) {
    case 0:
      background('#039393');
      drawScene0();
      break;
    case 1:
      drawScene1();
      break;
  }
}

function drawScene0() {
  // キャンバスに合わせて四角形のサイズを動的に決定
  let rectWidth = width * 0.625; // 画面幅の62.5%
  let rectHeight = height * 0.555; // 画面高さの55.5%

  // 白色の四角形を描画
  fill(255);
  rectMode(CENTER);
  rect(width / 2, height / 2, rectWidth, rectHeight);

  // テキストのサイズを画面サイズに応じて設定
  let textSizeValue = width * 0.033; // 画面幅の3.3%
  let imgX = width / 2 - img.width / 2;
  let imgY = height / 2 - img.height / 2;

  image(img, imgX, imgY);
  textSize(textSizeValue);
  fill(0);
  text("「初音ミク」から\n友達申請が来ています", width / 2, height / 2 - rectHeight / 4);

  // 「友達になる」ボタンを描画
  fill('#039393');
  rect(btnX, btnY, btnWidth, btnHeight);
  fill(255);
  textSize(textSizeValue * 0.75); // テキストサイズをボタン用に調整
  text("友達を追加する", btnX, btnY);

}
function drawScene1() {
  background('#039393');
  let x = width / 2; // メッセージボックスの中心X座標
  let startY = height * 0.6; // 画面の下部から開始
  let y = startY;
  let boxHeight = height * 0.08; // 画面高さの8%
  let padding = width * 0.01; // テキストのパディング
  let margin = height * 0.02; // メッセージボックス間のマージン
  let textSizeValue = width * 0.02;
  textSize(textSizeValue);

  for (let i = messages.length - 1; i >= 0; i--) {
    let msgWidth = textWidth(messages[i].text) + padding * 2;
    msgWidth = max(msgWidth, width * 0.2); // 最小幅を保証
    fill(255);

    // 角丸の四角形を描画
    rectMode(CORNER);
    rect(x / 3, y, msgWidth, boxHeight, boxHeight / 5);
    fill(0);

    // テキストの描画位置と揃え方を設定
    textAlign(LEFT, TOP);
    // テキストを描画（メッセージボックスの左端からpadding分右にずらして描画）
    text(messages[i].text, x / 3 + padding, y + padding);

    // 次のメッセージボックスのY座標を更新
    y -= boxHeight + margin;
    // 画面上部に達したらループを抜ける
    if (y < 0) break;
  }
}


function mousePressed() {
  // ボタンの当たり判定
  if (scene === 0 && mouseX >= btnX - btnWidth / 2 && mouseX <= btnX + btnWidth / 2 &&
    mouseY >= btnY - btnHeight / 2 && mouseY <= btnY + btnHeight / 2) {
    scene = 1; // シーンを1に変更
    player.requestPlay();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButtonSize(); // ウィンドウのサイズが変わったらボタンのサイズも更新
}

function updateButtonSize() {
  // ボタンのサイズと位置を動的に決定
  btnWidth = width * 0.3125; // 画面幅の31.25%
  btnHeight = height * 0.166; // 画面高さの16.6%
  btnX = width / 2;
  btnY = height / 2 + height * 0.185; // 画面高さの18.5%下
}
