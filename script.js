// --------------------
// script.js 完全版（バー内動的ラベル対応）
// --------------------

// 24場固定データ
const raceFields = [
  { id: 1, name: "桐生" },
  { id: 2, name: "戸田" },
  { id: 3, name: "江戸川" },
  { id: 4, name: "平和島" },
  { id: 5, name: "多摩川" },
  { id: 6, name: "浜名湖" },
  { id: 7, name: "蒲郡" },
  { id: 8, name: "常滑" },
  { id: 9, name: "津" },
  { id: 10, name: "三国" },
  { id: 11, name: "びわこ" },
  { id: 12, name: "住之江" },
  { id: 13, name: "尼崎" },
  { id: 14, name: "鳴門" },
  { id: 15, name: "丸亀" },
  { id: 16, name: "児島" },
  { id: 17, name: "宮島" },
  { id: 18, name: "徳山" },
  { id: 19, name: "下関" },
  { id: 20, name: "若松" },
  { id: 21, name: "芦屋" },
  { id: 22, name: "福岡" },
  { id: 23, name: "唐津" },
  { id: 24, name: "大村" }
];

// --------------------
// グリッド作成
// --------------------
function renderGrid() {
  const gridContainer = document.getElementById("gridContainer");
  gridContainer.innerHTML = "";

  raceFields.forEach(field => {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.id = field.id;

    // 場名
    const nameEl = document.createElement("div");
    nameEl.className = "field-name";
    nameEl.textContent = field.name;
    cell.appendChild(nameEl);

    // 選手番号入力欄
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.className = "player-input";
    inputEl.placeholder = "選手番号";
    inputEl.addEventListener("input", () => updateCalculations(field.id));
    cell.appendChild(inputEl);

    // 決まり手欄
    const resultEl = document.createElement("div");
    resultEl.className = "result-field";
    cell.appendChild(resultEl);

    // 総合期待度バー
    const expectationEl = document.createElement("div");
    expectationEl.className = "expectation-container";

    const barEl = document.createElement("div");
    barEl.className = "expectation-bar";
    expectationEl.appendChild(barEl);

    const percentLabel = document.createElement("span");
    percentLabel.className = "expectation-label";
    percentLabel.textContent = "0%"; // 初期値
    barEl.appendChild(percentLabel);

    const totalValue = document.createElement("span");
    totalValue.className = "expectation-total";
    totalValue.textContent = "0%"; // 初期値
    expectationEl.appendChild(totalValue);

    cell.appendChild(expectationEl);

    // 展開解析欄
    const analysisEl = document.createElement("div");
    analysisEl.className = "analysis-field";
    cell.appendChild(analysisEl);

    // 買い目欄
    const betsEl = document.createElement("div");
    betsEl.className = "bets-field";
    cell.appendChild(betsEl);

    // 的中率シミュレーション欄
    const hitEl = document.createElement("div");
    hitEl.className = "hit-field";
    cell.appendChild(hitEl);

    // 信頼度メーター欄
    const meterEl = document.createElement("div");
    meterEl.className = "meter-field";
    cell.appendChild(meterEl);

    gridContainer.appendChild(cell);
  });
}

// --------------------
// 計算ロジック
// --------------------
function updateCalculations(fieldId) {
  const field = raceFields.find(f => f.id === fieldId);
  const cell = document.querySelector(`.grid-cell[data-id='${fieldId}']`);
  if (!cell) return;

  const playerInput = cell.querySelector(".player-input").value;

  // 決まり手計算
  const resultEl = cell.querySelector(".result-field");
  resultEl.textContent = calcDecision(playerInput);

  // 総合期待度計算
  const expectationBar = cell.querySelector(".expectation-bar");
  const percent = calcExpectation(playerInput);
  expectationBar.style.width = percent + "%";

  // バー内ラベル更新（動的）
  const percentLabel = cell.querySelector(".expectation-label");
  percentLabel.textContent = percent + "%";

  // バー右端総合数値
  const totalValue = cell.querySelector(".expectation-total");
  totalValue.textContent = calcTotalExpectation(playerInput) + "%";

  // 展開解析
  const analysisEl = cell.querySelector(".analysis-field");
  analysisEl.textContent = calcAnalysis(playerInput);

  // 買い目
  const betsEl = cell.querySelector(".bets-field");
  betsEl.textContent = calcBets(playerInput);

  // 的中率シミュレーション
  const hitEl = cell.querySelector(".hit-field");
  hitEl.textContent = calcHitRate(playerInput);

  // 信頼度メーター
  const meterEl = cell.querySelector(".meter-field");
  meterEl.textContent = calcTrust(playerInput);
}

// --------------------
// 各計算式
// --------------------
function calcDecision(input) {
  if (!input) return "";
  const options = ["逃げ", "差し", "まくり", "恵まれ"];
  return options[input.length % options.length];
}

function calcExpectation(input) {
  if (!input) return 0;
  return Math.min(100, input.length * 10 + 20);
}

function calcTotalExpectation(input) {
  if (!input) return 50; // サンプル総合値
  return Math.min(100, input.length * 12 + 30);
}

function calcAnalysis(input) {
  if (!input) return "";
  return `展開${input}`;
}

function calcBets(input) {
  if (!input) return "";
  return `${input}→${parseInt(input) + 1}`;
}

function calcHitRate(input) {
  if (!input) return "";
  return `${Math.min(100, input.length * 15)}%`;
}

function calcTrust(input) {
  if (!input) return "";
  return `${Math.min(100, input.length * 20)}%`;
}

// --------------------
// 初期レンダリング
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
});
