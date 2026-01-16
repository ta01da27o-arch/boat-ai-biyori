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
const desc = document.getElementById("stadiumDescription");
const lanesDiv = document.getElementById("lanes");
const analysisResult = document.getElementById("analysisResult");
document.getElementById("backBtn").onclick = () => {
  screenDetail.classList.add("hidden");
  screenStadium.classList.remove("hidden");
};

stadiums.forEach(name => {
  const d = document.createElement("div");
  d.className = "stadium-card";
  d.textContent = name;
  d.onclick = () => openDetail(name);
  grid.appendChild(d);
});

let laneData = [];

function openDetail(name) {
  screenStadium.classList.add("hidden");
  screenDetail.classList.remove("hidden");
  detailHeader.textContent = name;
  desc.innerHTML = "イン逃げ傾向<br>捲り控えめ";
  lanesDiv.innerHTML = "";
  laneData = [];
  analysisResult.textContent = "選手番号を入力してください";

  for (let i = 1; i <= 6; i++) {
    const lane = document.createElement("div");
    lane.className = "lane";
    lane.innerHTML = `
      <div class="lane-title">${i}枠</div>
      <input type="number" placeholder="選手番号">
      <div class="finish"></div>
    `;
    const input = lane.querySelector("input");
    const finish = lane.querySelector(".finish");

    input.oninput = () => {
      if (!input.value) return;
      const rates = dummyFinish(Number(input.value));
      laneData[i-1] = { lane:i, rates };
      finish.innerHTML = finishHTML(rates);
      analyze();
    };
    lanesDiv.appendChild(lane);
  }
}

function dummyFinish(n) {
  return {
    escape: 30 + n % 20,
    diff: 15 + n % 15,
    makuri: 20 + n % 20,
    makuriDiff: 10 + n % 10
  };
}

function finishHTML(f) {
  return `
    ${row("逃げ", f.escape)}
    ${row("差し", f.diff)}
    ${row("捲り", f.makuri)}
    ${row("捲り差し", f.makuriDiff)}
  `;
}

function row(l,v){
  return `
  <div class="finish-row">
    <div class="finish-label">${l}</div>
    <div class="finish-bar-bg">
      <div class="finish-bar" style="width:${v}%"></div>
    </div>${v}%
  </div>`;
}

/* ⭐ 展開解析ロジック */
function analyze() {
  if (laneData.length < 6) return;

  let leader = null;
  let finisher = null;

  laneData.forEach(d => {
    const max = Math.max(...Object.values(d.rates));
    d.max = max;
    d.type = Object.keys(d.rates).find(k => d.rates[k] === max);
  });

  leader = laneData.reduce((a,b)=> a.max>b.max?a:b);
  finisher = laneData
    .filter(d=>d.type==="diff"||d.type==="makuriDiff")
    .reduce((a,b)=> a.max>b.max?a:b, leader);

  analysisResult.innerHTML = `
    ⭐ 主導権：${leader.lane}枠（${label(leader.type)}）<br>
    ⭐ 展開向き：${finisher.lane}枠（${label(finisher.type)}）
  `;
}

function label(t){
  return {escape:"逃げ",diff:"差し",makuri:"捲り",makuriDiff:"捲り差し"}[t];
}