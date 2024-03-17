

let sceneStartTime = 0; // シーンが開始された時の時間を格納
let buttonEnabled = false; // ボタンが有効かどうかを追跡
let countdown = 5; // カウントダウン開始値
const buttonTexts = [
  ["希望", "笑顔", "未来"],
  ["光", "息吹", "成長"],
  ["友情", "記憶", "感謝"],
  ["夢", "冒険", "自由"],
  ["愛", "絆", "支え"],
  ["旅", "発見", "喜び"],
  ["共有", "心", "強さ"],
  ["挑戦", "勇気", "新た"],
  ["ｻﾝｺﾞﾁｬｰﾝ!!", "ｻﾝｺﾞﾁｬﾝ!?", "ｻﾝｺﾞﾁｬｰﾝ!!"],
  ["輝き", "星", "願い"],
  ["信じ", "力", "進む"],
  ["分かち合い", "喜び", "無限"],
  ["勝利", "笑顔", "再会"],
  ["贈り物", "特別", "今日"],
  ["未知", "探求", "奇跡"],
  ["瞬間", "記憶", "美しい"],
  ["変化", "成長", "一瞬"],
  ["踏み出す", "希望", "未来"],
  ["輝く", "瞬き", "星空"],
  ["歌", "響き", "共鳴"],
  ["溢れる", "感謝", "幸せ"],
  ["夢見る", "可能性", "宇宙"],
  ["絶えず", "挑戦", "熱狂"],
  ["結びつき", "永遠", "約束"],
  ["心", "躍る", "可能性"],
  ["繋がり", "永久", "記憶"],
  ["笑顔", "終わり", "始まり"],
  ["希望", "輝き", "未来"],
  ["応援", "声援", "一緒に"],
  ["輝く", "君", "星"],
  ["共に", "歩む", "道"],
  ["夢", "描く", "一緒に"],
  ["さんごちゃーん", "さんごーーー", "さんごちゃーーん!!"],
  ["心", "つながる", "絆"],
  ["感動", "共感", "友情"],
  ["超える", "困難", "手を取り"],
  ["成長", "共に", "輝く"],
  ["挑戦", "楽しむ", "みんな"],
  ["信じる", "支え", "共に"],
  ["走れ", "希望", "輝く"],
  ["ひなみちゃん", "16歳の誕生日！", "おめでとう！"],
  ["ひなみちゃん", "16歳の誕生日！", "おめでとう！"]
];

let currentPhraseIndex = 0;
const { Player, Ease } = TextAliveApp;

const player = new Player({
  app: {
    appAuthor: "Jun Kato",
    appName: "Basic example"
  },
  token: "m5RwWgwhuGy234ir",
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
  //https://www.youtube.com/watch?v=-2KzcaiyBFo
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
let isFinish = false;
function animatePhrase(now, unit) {
  if (unit.contains(now) && currentPhrase !== unit.text) {
    currentPhrase = unit.text;
    updateButtonTexts();
    messages.push({ text: unit.text, time: now });

    // すべてのフレーズが追加された後の処理をここに記述する
    if (messages.length === 41) { // 総フレーズ数は貴様が設定する必要がある
      // ここで終了時の演出を開始する
      isFinish = true;

    }
  }
}



let scene = 0;
let btnX, btnY, btnWidth, btnHeight; // ボタンの位置とサイズ

function setup() {

  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  buttons = [
    { x: width / 4, y: height / 2 + height / 3 + 40, w: width / 5, h: 30, text: "" },
    { x: width / 2, y: height / 2 + height / 3 + 40, w: width / 5, h: 30, text: "" },
    { x: width - width / 4, y: height / 2 + height / 3 + 40, w: width / 5, h: 30, text: "" }
  ];
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
  let textSizeValue = width * 0.033; // 画面幅の3.3%
  if (sceneStartTime === 0) {
    sceneStartTime = millis();
  }

  // 現在の時間とシーン開始時間の差分を計算
  let elapsedTime = millis() - sceneStartTime;

  // カウントダウンの計算（5秒から開始して1秒ごとに減らす）
  let remainingTime = countdown - Math.floor(elapsedTime / 1000);

  // キャンバスに合わせて四角形のサイズを動的に決定
  let rectWidth = width * 0.625; // 画面幅の62.5%
  let rectHeight = height * 0.555; // 画面高さの55.5%

  // 白色の四角形を描画
  fill(255);
  rectMode(CENTER);
  rect(width / 2, height / 2, rectWidth, rectHeight);

  // カウントダウンが0より大きい場合は、カウントダウンを表示

  // テキストのサイズを画面サイズに応じて設定

  imageDisplayScene0();
  if (remainingTime > 0) {
    fill(0); // テキストの色
    textSize(textSizeValue); // テキストサイズ
    textAlign(CENTER, CENTER);
    text(remainingTime, width / 2, height / 2 + rectHeight / 4); // カウントダウンを描画
  } else {
    buttonEnabled = true;
  }
  textSize(textSizeValue);
  fill(0);
  text("「初音ミク」から\n友達申請が来ています", width / 2, height / 2 - rectHeight / 4);
  if (buttonEnabled) {
    // 「友達になる」ボタンを描画
    fill('#039393');
    rect(btnX, btnY, btnWidth, btnHeight);
    fill(255);
    textSize(textSizeValue * 0.75); // テキストサイズをボタン用に調整
    text("友達を追加する", btnX, btnY);
  }
}
function drawScene1() {

  background('#039393');

  let x = width / 2; // メッセージボックスの中心X座標
  let startY = height * 0.6; // 画面の下部から開始
  let y = startY;
  let boxHeight = height * 0.08; // 画面高さの8%
  let padding = width * 0.01; // テキストのパディング
  let margin = height * 0.03; // メッセージボックス間のマージン
  let textSizeValue = width * 0.02;
  var textSmallSizeValue = width * 0.01;
  textSize(textSizeValue);

  for (let i = messages.length - 1; i >= 0; i--) {
    let msgWidth = textWidth(messages[i].text) + padding * 2;
    msgWidth = max(msgWidth, width * 0.2); // 最小幅を保証
    fill(255);

    // 角丸の四角形を描画
    rectMode(CORNER);
    let rectX = x / 3;
    let rectY = y;
    rect(rectX, rectY, msgWidth, boxHeight, boxHeight / 5);

    fill(0);
    // テキストの描画位置と揃え方を設定
    textAlign(LEFT, TOP);
    // テキストを描画
    text(messages[i].text, rectX + padding, rectY + padding);

    // 「初音ミク」テキストの描画位置を調整
    fill(255); // テキストの色を白に
    textSize(textSmallSizeValue); // 「初音ミク」テキストのサイズ
    let mikuTextX = rectX; // メッセージボックスの左に配置
    let mikuTextY = rectY + (boxHeight / 2) - (textSizeValue + 20); // メッセージボックスの上部に合わせる
    text('初音ミク', mikuTextX, mikuTextY);

    // 画像の描画位置を調整
    let imageX = mikuTextX - 120; // 「初音ミク」テキストのさらに左
    let imageY = mikuTextY + (boxHeight / 4); // メッセージボックスの高さに合わせる
    imageDisplayScene1(imageX, imageY);

    // テキストサイズを元に戻す
    textSize(textSizeValue);

    // 次のメッセージボックスのY座標を更新
    y -= boxHeight + margin;
    // 画面上部に達したらループを抜ける
    if (y < 0) {
      break;
    }
  }
  let rectWidth = width * 0.8; // 画面幅の62.5%
  let rectHeight = height * 0.2; // 画面高さの55.5%

  rectMode(CENTER);
  rect(width / 2, height / 2 + height / 3, rectWidth, rectHeight);
  fill(220);
  rect(width / 2, height / 2 + height / (3.3), rectWidth / 2 + rectWidth / (2.5), rectHeight / (2.5), rectHeight / 5);
  fill(128); // 灰色
  let inputFormY = height / 2 + height / 3 - 25; // 入力フォームの位置
  textAlign(CENTER, CENTER);
  text("|メッセージを入力", width / 4, inputFormY);
  // 3つの擬似的なボタンを描画
  buttons.forEach(button => {
    fill('#039393'); // ボタンの色
    rect(button.x, button.y, button.w, button.h, 5); // 角丸の四角形ボタン
    fill(255); // テキストの色
    textSize(textSizeValue); // テキストのサイズ
    textAlign(CENTER, CENTER);
    text(button.text, button.x, button.y);
  });
  if (isFinish) {
    if (sceneStartTime === 0) {
      sceneStartTime = millis();
    }

    // 現在の時間とシーン開始時間の差分を計算
    let elapsedTime = millis() - sceneStartTime;
    let remainingTime = countdown - Math.floor(elapsedTime / 1000);
    if (remainingTime > 0) {

    } else {
      currentPhraseIndex++;
      updateButtonTexts();
      let latestThreeMessages = messages.slice(-3);
      messages.length = 0;
      messages.push(...latestThreeMessages, "ひなみちゃん誕生日おめでとう！", "ひなみちゃん誕生日おめでとう！", "ひなみちゃん誕生日おめでとう！");

      for (let i = messages.length - 1; i >= 0; i--) {

        msgWidth = textWidth(messages[i].text) + padding * 2;
        msgWidth = max(msgWidth, width * 0.2); // 最小幅を保証
        fill(255);

        // 角丸の四角形を描画
        rectMode(CORNER);
        rectX = x / 3;
        rectY = y;
        rect(rectX, rectY, msgWidth, boxHeight, boxHeight / 5);

        fill(0);
        // テキストの描画位置と揃え方を設定
        textAlign(LEFT, TOP);
        // テキストを描画
        text(messages[i].text, rectX + padding, rectY + padding);

        // 「初音ミク」テキストの描画位置を調整
        fill(255); // テキストの色を白に
        textSize(textSmallSizeValue); // 「初音ミク」テキストのサイズ
        let mikuTextX = rectX; // メッセージボックスの左に配置
        let mikuTextY = rectY + (boxHeight / 2) - (textSizeValue + 20); // メッセージボックスの上部に合わせる
        if (i === messages.length - 1) {
          displayText = "失礼";
        } else if (i === messages.length - 2) {
          displayText = "とけためんたこ";
        } else if (i === messages.length - 3) {
          displayText = "珍魚丼";
        } else {
          // それ以外の場合、「初音ミク」と表示
          displayText = "初音ミク";
        }
        text(displayText, mikuTextX, mikuTextY);
        // 画像の描画位置を調整
        let imageX = mikuTextX - 120; // 「初音ミク」テキストのさらに左
        let imageY = mikuTextY + (boxHeight / 4); // メッセージボックスの高さに合わせる
        imageDisplayScene1(imageX, imageY);

        // テキストサイズを元に戻す
        textSize(textSizeValue);

        // 次のメッセージボックスのY座標を更新
        y -= boxHeight + margin;
        // 画面上部に達したらループを抜ける
        if (y < 0) {
          isFinish = false;
          break;
        }
      }
    }
  }
}

let img1, mikuImage, kaigan, mentako, siturei, tin;

function preload() {
  img1 = loadImage("hatsunemiku.jpg"); // 画像のパスを指定
  mikuImage = loadImage("hatsuneKOSHIKI.jpg");
  kaigan = loadImage("kaigan.jpg");
  mentako = loadImage("mentako.jpg");
  siturei = loadImage("siturei.jpg");
  tin = loadImage("tin.jpg");
}

function imageDisplayScene0() {
  let imgX = width / 2 - img1.width / 2;
  let imgY = height / 2 - img1.height / 2;

  image(img1, imgX, imgY);
}

function imageDisplayScene1(x, y) {

  image(mikuImage, x, y, mikuImage.width / 5, mikuImage.height / 5);
}

function imageDisplayAll(x, y) {
  //image(kaigan, x, y, mikuImage.width / 5, mikuImage.height / 5);
  image(siturei, x, y + 100, mikuImage.width / 5, mikuImage.height / 5)
  image(mentako, x, y + 200, mikuImage.width / 5, mikuImage.height / 5)
  image(tin, x, y + 300, mikuImage.width / 5, mikuImage.height / 5)
}

function mousePressed() {
  if (buttonEnabled && scene === 0 && mouseX >= btnX - btnWidth / 2 && mouseX <= btnX + btnWidth / 2 &&
    mouseY >= btnY - btnHeight / 2 && mouseY <= btnY + btnHeight / 2) {
    scene = 1; // シーンを1に変更
    sceneStartTime = 0;
    countdown = 10;
    player.requestPlay();
  }
  if (scene == 1) {
    buttons.forEach((button, index) => {
      if (mouseX >= button.x - button.w / 2 && mouseX <= button.x + button.w / 2 &&
        mouseY >= button.y - button.h / 2 && mouseY <= button.y + button.h / 2) {
        console.log(button.text + " がクリックされました");
        // ボタンがクリックされたときの処理
      }
    });
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

  // buttons配列のボタンのサイズと位置を更新
  buttons[0].x = width / 4; // 画面幅の1/4
  buttons[0].y = height / 2 + height / 3 + 40;
  buttons[0].w = width / 5; // 画面幅の1/5
  buttons[0].h = 30; // 高さは固定値

  buttons[1].x = width / 2; // 画面幅の中央
  buttons[1].y = height / 2 + height / 3 + 40;
  buttons[1].w = width / 5; // 画面幅の1/5
  buttons[1].h = 30; // 高さは固定値

  buttons[2].x = width - width / 4; // 画面幅の3/4
  buttons[2].y = height / 2 + height / 3 + 40;
  buttons[2].w = width / 5; // 画面幅の1/5
  buttons[2].h = 30; // 高さは固定値
}

function updateButtonTexts() {
  // currentPhraseIndexの値がbuttonTexts配列の長さ以上になる場合、0にリセットする
  if (currentPhraseIndex >= buttonTexts.length) {
    currentPhraseIndex = 0;
  }

  for (let i = 0; i < buttons.length; i++) {
    // ここでcurrentPhraseIndexを使用して安全にアクセスできる
    buttons[i].text = buttonTexts[currentPhraseIndex][i];
  }

  currentPhraseIndex++; // インデックスをインクリメントする
}


