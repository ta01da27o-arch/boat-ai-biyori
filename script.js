console.log("script.js は動いています");

// =====================
// 画面取得
// =====================
const stadiumScreen = document.getElementById("stadiumScreen");
const raceScreen = document.getElementById("raceScreen");
const analysisScreen = document.getElementById("analysisScreen");

// =====================
// 共通：画面切り替え
// =====================
function showScreen(screen) {
  stadiumScreen.classList.add("hidden");
  raceScreen.classList.add("hidden");
  analysisScreen.classList.add("hidden");

  screen.classList.remove("hidden");
}

// =====================
// 初期表示
// =====================
showScreen(stadiumScreen);

// =====================
// 24場生成
// =====================
const stadiums = [
  "桐生","戸田","江戸川","平和島",
  "多摩川","浜名湖","蒲郡","常滑",
  "津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島",
  "宮島","徳山","下関","若松",
  "芦屋","福岡","唐津","大村"
];

const stadiumGrid = document.querySelector(".stadium-grid");

stadiums.forEach(name => {
  const btn = document.createElement("button");
  btn.className = "stadium-btn";
  btn.textContent = name;

  btn.addEventListener("click", () => {
    document.getElementById("raceTitle").textContent = name;
    showScreen(raceScreen);
  });

  stadiumGrid.appendChild(btn);
});

// =====================
// レース番号生成
// =====================
const raceGrid = document.querySelector(".race-grid");

for (let i = 1; i <= 12; i++) {
  const btn = document.createElement("button");
  btn.className = "race-btn";
  btn.textContent = `${i}R`;

  btn.addEventListener("click", () => {
    showScreen(analysisScreen);
  });

  raceGrid.appendChild(btn);
}

// =====================
// 戻るボタン
// =====================
document.getElementById("backBtn").addEventListener("click", () => {
  showScreen(stadiumScreen);
});