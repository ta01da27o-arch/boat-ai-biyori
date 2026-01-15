/* ===== 仮・場データ ===== */
const stadiumData = {
  桐生: {
    1: ["イン逃げ率高め", "捲り率やや低下"]
  },
  戸田: {
    1: ["差し決着多め", "スタート巧者有利"]
  },
  default: {
    1: ["イン有利傾向", "展開次第で差し"]
  }
};

const stadiums = [
  "桐生","戸田","江戸川","平和島","多摩川","浜名湖",
  "蒲郡","常滑","津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島","宮島","徳山",
  "下関","若松","芦屋","福岡","唐津","大村"
];

const grid = document.getElementById("stadiumGrid");
const screenStadium = document.getElementById("screen-stadium");
const screenDetail = document.getElementById("screen-detail");

const detailHeader = document.getElementById("detailHeader");
const description = document.getElementById("stadiumDescription");
const monthSelect = document.getElementById("monthSelect");
const backBtn = document.getElementById("backBtn");

/* ===== 24場描画 ===== */
stadiums.forEach(name => {
  const card = document.createElement("div");
  card.className = "stadium-card";
  card.textContent = name;
  card.onclick = () => openDetail(name);
  grid.appendChild(card);
});

/* ===== 詳細画面 ===== */
function openDetail(name) {
  screenStadium.classList.add("hidden");
  screenDetail.classList.remove("hidden");

  detailHeader.textContent = name;
  updateDescription(name, monthSelect.value);
}

backBtn.onclick = () => {
  screenDetail.classList.add("hidden");
  screenStadium.classList.remove("hidden");
};

monthSelect.onchange = () => {
  updateDescription(detailHeader.textContent, monthSelect.value);
};

/* ===== 特性表示 ===== */
function updateDescription(name, month) {
  const data =
    stadiumData[name]?.[month] ||
    stadiumData.default[month];

  description.innerHTML = data.join("<br>");
}