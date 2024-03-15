/**
 * TextAlive App API script tag example
 * https://github.com/TextAliveJp/textalive-app-script-tag
 *
 * 発声中の歌詞をフレーズ単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * 
 * `script` タグで TextAlive App API を読み込んでいること以外は https://github.com/TextAliveJp/textalive-app-phrase と同内容です。
 */

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

function animatePhrase(now, unit) {
  // 現在のフレーズを更新
  if (unit.contains(now)) {
    currentPhrase = unit.text;
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
      background('#039393');
      let textSizeValue = width * 0.033; // 画面幅の3.3%
      textSize(textSizeValue);
      fill(255);
      text(currentPhrase, width / 2, height / 2); // 現在のフレーズを表示
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
  textSize(textSizeValue);
  fill(0);
  text("「初音ミク」から\n友達申請が来ています", width / 2, height / 2 - rectHeight / 4);

  // 「友達になる」ボタンを描画
  fill('#039393');
  rect(btnX, btnY, btnWidth, btnHeight);
  fill(255);
  textSize(textSizeValue * 0.75); // テキストサイズをボタン用に調整
  text("友達を追加する", btnX, btnY);
  let imgX = width / 2 - img.width / 2;
  let imgY = height / 2 - img.height / 2;

  // 画像を描画
  image(img, imgX, imgY);
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
