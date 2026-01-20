// ============================
// データ（仮）
// ============================
const stadiums = [
  "桐生","戸田","江戸川","平和島",
  "多摩川","浜名湖","蒲郡","常滑",
  "津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島",
  "宮島","徳山","下関","若松",
  "芦屋","福岡","唐津","大村"
];

// 勝負できそうな場（仮）
const candidateStadiums = ["桐生","住之江","丸亀"];

// 勝負レース（仮）
const candidateRaces = [4,5,9];

// ============================
// 初期表示：24場
// ============================
const stadiumGrid = document.querySelector(".stadium-grid");

stadiums.forEach(name => {
  const div = document.createElement("div");
  div.className = "stadium";
  div.textContent = name;

  if (candidateStadiums.includes(name)) {
    div.classList.add("candidate");
  }

  div.onclick = () => openRaceScreen(name);
  stadiumGrid.appendChild(div);
});

// ============================
// レース番号画面
// ============================
const stadiumScreen = document.getElementById("stadiumScreen");
const raceScreen = document.getElementById("raceScreen");
const raceGrid = document.querySelector(".race-grid");
const raceTitle = document.getElementById("raceTitle");
const backBtn = document.getElementById("backBtn");

function openRaceScreen(stadiumName) {
  stadiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");

  raceTitle.textContent = stadiumName;

  raceGrid.innerHTML = "";
  for (let r = 1; r <= 12; r++) {
    const div = document.createElement("div");
    div.className = "race";
    div.textContent = `${r}R`;

    if (candidateRaces.includes(r)) {
      div.classList.add("candidate");
    }

    raceGrid.appendChild(div);
  }
}

backBtn.onclick = () => {
  raceScreen.classList.add("hidden");
  stadiumScreen.classList.remove("hidden");
};