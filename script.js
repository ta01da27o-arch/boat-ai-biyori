const stadiums = [
  "桐生","戸田","江戸川","平和島","多摩川","浜名湖",
  "蒲郡","常滑","津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島","宮島","徳山",
  "下関","若松","芦屋","福岡","唐津","大村"
];

const grid = document.getElementById("stadiumGrid");
const screenStadium = document.getElementById("screen-stadium");
const screenDetail = document.getElementById("screen-detail");
const headerDetail = document.getElementById("headerDetail");
const lanesDiv = document.getElementById("lanes");
const kimariteDiv = document.getElementById("kimarite");
const analysisDiv = document.getElementById("analysis");
const buysDiv = document.getElementById("buys");

document.getElementById("backBtn").onclick = () => {
  screenDetail.classList.add("hidden");
  screenStadium.classList.remove("hidden");
};

stadiums.forEach(s => {
  const d = document.createElement("div");
  d.className = "stadium";
  d.textContent = s;
  d.onclick = () => openDetail(s);
  grid.appendChild(d);
});

let scores = [];

function openDetail(name) {
  screenStadium.classList.add("hidden");
  screenDetail.classList.remove("hidden");
  headerDetail.textContent = name;
  lanesDiv.innerHTML = "";
  kimariteDiv.innerHTML = "";
  analysisDiv.innerHTML = "";
  buysDiv.innerHTML = "";
  scores = [];

  for (let i = 1; i <= 6; i++) {
    const l = document.createElement("div");
    l.className = "lane";
    l.innerHTML = `
      ${i}コース
      <input type="number" placeholder="選手番号">
    `;
    l.querySelector("input").oninput = e => {
      scores[i-1] = calc(i, Number(e.target.value));
      if (scores.filter(Boolean).length === 6) render();
    };
    lanesDiv.appendChild(l);
  }
}

function calc(lane, num) {
  return {
    lane,
    start: (num % 10),
    power: 40 + num % 40
  };
}

function render() {
  kimariteDiv.innerHTML = "";
  scores.forEach(s => {
    kimariteDiv.innerHTML += `
      ${s.lane}コース
      <div class="bar-bg">
        <div class="bar" style="width:${s.power}%"></div>
      </div>
    `;
  });

  const sorted = [...scores].sort((a,b)=>b.power-a.power);
  const attacker = sorted[0];
  const cut = sorted[5].lane;

  analysisDiv.innerHTML =
    `1・2コースのスタートに不安あり。<br>
     ${attacker.lane}コースの機力・実績が高く、頭を叩く展開。<br>
     外の${attacker.lane+1}・${attacker.lane+2}コースが追従。<br>
     ${attacker.lane}コース頭から。`;

  const buys = [
    `${attacker.lane}-5-6`,
    `${attacker.lane}-6-5`,
    `5-${attacker.lane}-3`,
    `5-${attacker.lane}-6`
  ].filter(b => !b.includes(cut));

  buysDiv.innerHTML = buys.join("<br>");
}