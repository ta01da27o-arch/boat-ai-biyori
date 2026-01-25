// ================================
// ① 24場データ
// ================================

const stadiums = [
  "桐生","戸田","江戸川","平和島","多摩川","浜名湖",
  "蒲郡","常滑","津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島","宮島","徳山",
  "下関","若松","芦屋","福岡","唐津","大村"
];

const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

const stadiumScreen = document.getElementById("stadiumScreen");
const raceScreen = document.getElementById("raceScreen");
const playerScreen = document.getElementById("playerScreen");

const raceTitle = document.getElementById("raceTitle");
const backBtn = document.getElementById("backBtn");

// ================================
// ② 24場グリッド生成
// ================================

stadiums.forEach((name, index) => {
  const div = document.createElement("div");
  div.className = "stadium-item";
  div.textContent = name;
  div.addEventListener("click", () => showRaceScreen(name));
  stadiumGrid.appendChild(div);
});

// ================================
// ③ レース番号生成
// ================================

function showRaceScreen(stadiumName) {

  stadiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");

  raceTitle.textContent = stadiumName + " レース選択";

  raceGrid.innerHTML = "";

  for (let i = 1; i <= 12; i++) {
    const div = document.createElement("div");
    div.className = "race-item";
    div.textContent = i + "R";
    div.addEventListener("click", () => showPlayerScreen(stadiumName, i));
    raceGrid.appendChild(div);
  }
}

// ================================
// ④ 選手入力画面
// ================================

function showPlayerScreen(stadiumName, raceNo) {

  raceScreen.classList.add("hidden");
  playerScreen.classList.remove("hidden");

  raceTitle.textContent = stadiumName + " " + raceNo + "R";

}

// ================================
// 戻るボタン
// ================================

backBtn.addEventListener("click", () => {

  playerScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");

});

// ================================
// ⑤ 総合期待度計算（シンプルAI）
// ================================

const playerInputs = document.querySelectorAll(".player-input");
const expectationRows = document.querySelectorAll(".expectation-row");

// 内部スコア保持
let expectations = [0,0,0,0,0,0];

function calculateExpectation() {

  expectations = [];

  playerInputs.forEach((input, i) => {

    const num = parseInt(input.value) || 0;

    // 超シンプル評価ロジック
    // 数字が小さいほど強いと仮定
    let score = 100 - num;

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    expectations.push(score);

  });

  updateExpectationView();
  generateRaceComment();
  generateBet();

}

// ================================
// ⑥ 総合期待度表示
// ================================

function updateExpectationView() {

  expectationRows.forEach((row, i) => {

    const bar = row.querySelector(".expectation-bar div");
    const value = row.querySelector(".expectation-value");

    bar.style.width = expectations[i] + "%";
    value.textContent = expectations[i] + "%";

  });

}

// ================================
// ⑦ 展開解析コメント自動生成
// ================================

const commentBox = document.querySelector(".analysis-text");

function generateRaceComment() {

  const max = Math.max(...expectations);
  const min = Math.min(...expectations);

  let comment = "";

  if (max - min < 15) {
    comment = "各艇拮抗した混戦模様。波乱含みの展開が予想されます。";
  } 
  else if (expectations[0] === max) {
    comment = "イン有利な展開。逃げ中心の堅い決着が濃厚です。";
  } 
  else if (expectations[1] === max || expectations[2] === max) {
    comment = "差し・捲りが決まりやすい展開。中枠勢に注目です。";
  } 
  else {
    comment = "外枠勢の一発に注意。高配当が狙える展開です。";
  }

  commentBox.textContent = comment;

}

// ================================
// ⑧ 買い目自動算出（超シンプル）
// ================================

const betContents = document.querySelectorAll(".bet-content");

function generateBet() {

  // スコア順に並び替え
  const order = expectations
    .map((v, i) => ({ score: v, course: i + 1 }))
    .sort((a, b) => b.score - a.score);

  const first = order[0].course;
  const second = order[1].course;
  const third = order[2].course;

  if (betContents.length >= 3) {
    betContents[0].textContent = `${first}-${second}-${third}`;
    betContents[1].textContent = `${first}-${third}-${second}`;
    betContents[2].textContent = `${second}-${first}-${third}`;
  }

}

// ================================
// ⑨ 入力監視
// ================================

playerInputs.forEach(input => {
  input.addEventListener("input", calculateExpectation);
});