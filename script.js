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
const rankBars = document.getElementById("rankBars");
const analysisResult = document.getElementById("analysisResult");
const buyResult = document.getElementById("buyResult");
const trustResult = document.getElementById("trustResult");

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

let lanes = [];

function openDetail(name) {
  screenStadium.classList.add("hidden");
  screenDetail.classList.remove("hidden");
  detailHeader.textContent = name;
  desc.innerHTML = "イン有利傾向 / 冬季は握りにくい";
  lanesDiv.innerHTML = "";
  rankBars.innerHTML = "";
  analysisResult.innerHTML = "";
  buyResult.innerHTML = "";
  trustResult.innerHTML = "";
  lanes = [];

  for (let i = 1; i <= 6; i++) {
    const l = document.createElement("div");
    l.className = "lane";
    l.innerHTML = `
      <div class="lane-title">${i}コース</div>
      <input type="number" placeholder="選手番号">
    `;
    l.querySelector("input").oninput = e => {
      if (!e.target.value) return;
      lanes[i-1] = calcScore(i, Number(e.target.value));
      render();
    };
    lanesDiv.appendChild(l);
  }
}

function calcScore(lane, n) {
  let score;
  if (lane === 1) {
    score = 50 + n % 20 - 20;
  } else {
    score = 30 + n % 40;
  }
  return { lane, score: Math.max(5, score) };
}

function render() {
  if (lanes.filter(Boolean).length < 6) return;

  // 表示は1〜6固定
  const sorted = [...lanes].sort((a,b)=>b.score-a.score);
  const cut = sorted[5].lane;

  rankBars.innerHTML = "";
  lanes.forEach(d => {
    const isKill = d.lane === cut;
    rankBars.innerHTML += `
      <div class="rank-row ${isKill?"kill":""}">
        <div class="rank-label">${d.lane}コース</div>
        <div class="rank-bar-bg">
          <div class="rank-bar" style="width:${d.score}%"></div>
        </div>${d.score}%
      </div>
    `;
  });

  const attacker = sorted[0];
  const victim = attacker.lane > 1 ? attacker.lane - 1 : null;
  const chances = lanes
    .filter(d => d.lane > attacker.lane && d.lane !== cut)
    .map(d => d.lane);

  analysisResult.innerHTML =
    `${attacker.lane}コースが主導権。<br>` +
    (victim ? `${victim}コースは叩かれる展開。<br>` : "") +
    (chances.length ? `展開は${chances.join("・")}コースへ。` : "");

  // 買い目生成
  const buys = [];
  sorted.slice(0,4).forEach(a=>{
    sorted.slice(0,4).forEach(b=>{
      sorted.slice(0,4).forEach(c=>{
        if (a.lane!==b.lane && b.lane!==c.lane && a.lane!==c.lane) {
          if (!(a.lane > 1 && b.lane === a.lane-1)) {
            buys.push(`${a.lane}-${b.lane}-${c.lane}`);
          }
        }
      });
    });
  });

  buyResult.innerHTML = buys.slice(0,8).join("<br>");

  const topRate = (sorted[0].score + sorted[1].score) /
    lanes.reduce((s,d)=>s+d.score,0) * 100;

  trustResult.innerHTML =
    topRate > 65 ? "A（堅い）" :
    topRate > 55 ? "B（標準）" :
    "C（荒れ注意）";
}