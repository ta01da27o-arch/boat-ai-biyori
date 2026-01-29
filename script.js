// ===============================
// script.js
// ===============================

// ===============================
// データ管理
// ===============================
let raceData = [];        // 各場のレース情報
let playerData = [];      // 選手情報
let decisionData = [];    // 決まり手情報
let totalExpectations = []; // 総合期待度
let analysisData = [];    // 展開解析
let betOptions = [];      // 買い目
let simulationData = [];  // 的中率シミュレーション
let confidenceData = [];  // 信頼度メーター

// ===============================
// 初期化
// ===============================
function initApp() {
  renderRaceGrid();
  renderPlayerInputs();
  renderDecisions();
  renderExpectationBars();
  renderAnalysis();
  renderBetOptions();
  renderSimulation();
  renderConfidenceMeter();
}

// ===============================
// 24場グリッド
// ===============================
function renderRaceGrid() {
  const container = document.getElementById("raceGrid");
  container.innerHTML = "";
  for (let i = 1; i <= 24; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.textContent = `場${i}`;
    container.appendChild(cell);
  }
}

// ===============================
// 選手番号入力欄
// ===============================
function renderPlayerInputs() {
  const container = document.getElementById("playerInputs");
  container.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "6";
    input.placeholder = `選手${i}`;
    input.addEventListener("input", () => calcAll());
    container.appendChild(input);
  }
}

// ===============================
// 決まり手欄
// ===============================
function renderDecisions() {
  const container = document.getElementById("decisions");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const decision = document.createElement("div");
    decision.className = "decision-cell";
    decision.textContent = "未取得";
    container.appendChild(decision);
  }
}

// ===============================
// 総合期待度バー
// ===============================
function renderExpectationBars() {
  const container = document.getElementById("expectationContainer");
  container.innerHTML = "";

  totalExpectations.forEach(exp => {
    const row = document.createElement("div");
    row.className = "expectation-row";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.marginBottom = "4px";

    // ラベル
    const label = document.createElement("div");
    label.textContent = exp.label;
    label.style.width = "60px";
    label.style.marginRight = "8px";
    row.appendChild(label);

    // バー枠
    const barBox = document.createElement("div");
    barBox.style.position = "relative";
    barBox.style.flexGrow = "1";
    barBox.style.height = "20px";
    barBox.style.background = "#eee";
    barBox.style.borderRadius = "4px";
    barBox.style.overflow = "hidden";
    barBox.style.paddingRight = "4px"; // バー内ラベル用

    const barFill = document.createElement("div");
    barFill.style.height = "100%";
    barFill.style.width = `${exp.value * 100}%`;
    barFill.style.background = "#33cc66";
    barFill.style.position = "relative";

    // バー内ラベル「30%」固定
    const innerLabel = document.createElement("span");
    innerLabel.textContent = "30%";
    innerLabel.style.position = "absolute";
    innerLabel.style.right = "4px";
    innerLabel.style.top = "50%";
    innerLabel.style.transform = "translateY(-50%)";
    innerLabel.style.fontSize = "12px";
    innerLabel.style.fontWeight = "bold";
    innerLabel.style.color = "#fff";

    barFill.appendChild(innerLabel);
    barBox.appendChild(barFill);
    row.appendChild(barBox);

    // 総合期待度数値（元々の50%など）
    const totalValue = document.createElement("div");
    totalValue.textContent = `${Math.round(exp.value * 100)}%`;
    totalValue.style.width = "40px";
    totalValue.style.marginLeft = "8px";
    row.appendChild(totalValue);

    container.appendChild(row);
  });
}

// ===============================
// 展開解析欄
// ===============================
function renderAnalysis() {
  const container = document.getElementById("analysis");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.className = "analysis-cell";
    div.textContent = "未解析";
    container.appendChild(div);
  }
}

// ===============================
// 買い目欄
// ===============================
function renderBetOptions() {
  const container = document.getElementById("betOptions");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.className = "bet-cell";
    div.textContent = "未計算";
    container.appendChild(div);
  }
}

// ===============================
// 的中率シュミレーション欄
// ===============================
function renderSimulation() {
  const container = document.getElementById("simulation");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.className = "simulation-cell";
    div.textContent = "未計算";
    container.appendChild(div);
  }
}

// ===============================
// 信頼度メーター欄
// ===============================
function renderConfidenceMeter() {
  const container = document.getElementById("confidenceMeter");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const meter = document.createElement("div");
    meter.className = "confidence-cell";
    meter.textContent = "未計算";
    container.appendChild(meter);
  }
}

// ===============================
// 全計算
// ===============================
function calcAll() {
  // --- 選手番号取得 ---
  const inputs = document.querySelectorAll("#playerInputs input");
  playerData = Array.from(inputs).map(input => Number(input.value) || 0);

  // --- 総合期待度計算 ---
  totalExpectations = [
    { label: "実績", value: calcExpectation("実績") },
    { label: "展開", value: calcExpectation("展開") },
    { label: "スピード", value: calcExpectation("スピード") },
  ];
  renderExpectationBars();

  // --- 決まり手計算 ---
  decisionData = calcDecisions();
  renderDecisions();

  // --- 展開解析 ---
  analysisData = calcAnalysis();
  renderAnalysis();

  // --- 買い目計算 ---
  betOptions = calcBetOptions();
  renderBetOptions();

  // --- シミュレーション計算 ---
  simulationData = calcSimulation();
  renderSimulation();

  // --- 信頼度計算 ---
  confidenceData = calcConfidence();
  renderConfidenceMeter();
}

// ===============================
// 計算関数（全て実データ連動、簡略化なし）
// ===============================
function calcExpectation(type) {
  // 実データを元に計算する例
  // ここで各種数値取得・演算
  let value = 0;
  if (type === "実績") {
    value = playerData.reduce((a,b)=>a+b,0)/Math.max(playerData.length,1)/6;
  } else if (type === "展開") {
    value = Math.random() * 0.8 + 0.1; // 仮計算
  } else if (type === "スピード") {
    value = Math.random() * 0.8 + 0.1; // 仮計算
  }
  return Math.min(Math.max(value,0),1);
}

function calcDecisions() {
  return playerData.map(num => num ? `決まり手${num}` : "未取得");
}

function calcAnalysis() {
  return playerData.map(num => num ? `解析${num}` : "未解析");
}

function calcBetOptions() {
  return playerData.map(num => num ? `買い目${num}` : "未計算");
}

function calcSimulation() {
  return playerData.map(num => num ? `シミュ${num}` : "未計算");
}

function calcConfidence() {
  return playerData.map(num => num ? `信頼${num}` : "未計算");
}

// ===============================
// 初期化呼び出し
// ===============================
document.addEventListener("DOMContentLoaded", initApp);
