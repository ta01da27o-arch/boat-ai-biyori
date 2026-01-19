const stadiums = [
"桐生","戸田","江戸川","平和島","多摩川","浜名湖",
"蒲郡","常滑","津","三国","びわこ","住之江",
"尼崎","鳴門","丸亀","児島","宮島","徳山",
"下関","若松","芦屋","福岡","唐津","大村"
];

const colors = {
  1:"#fff",2:"#000",3:"#f33",4:"#39f",5:"#fc0",6:"#3a3"
};

let currentStadium = "";
let currentRace = "";

const stadiumHeader = document.getElementById("stadiumHeader");
const stadiumGrid = document.getElementById("stadiumGrid");
const raceView = document.getElementById("raceView");
const stadiumView = document.getElementById("stadiumView");
const detailView = document.getElementById("detailView");

const candidateRaceCount = Math.floor(Math.random()*6)+8;
stadiumHeader.textContent = `候補レース数 ${candidateRaceCount}R`;

stadiums.forEach(s => {
  const d = document.createElement("div");
  d.className = "stadium";
  d.textContent = s;
  d.onclick = () => openRace(s);
  stadiumGrid.appendChild(d);
});

function openRace(stadium) {
  currentStadium = stadium;
  stadiumView.classList.add("hidden");
  raceView.classList.remove("hidden");
  document.getElementById("raceHeader").textContent = stadium;

  const raceGrid = document.getElementById("raceGrid");
  raceGrid.innerHTML = "";

  for(let r=1;r<=12;r++){
    const d = document.createElement("div");
    d.className = "race";
    d.textContent = `${r}R`;
    d.onclick = ()=>openDetail(r);
    raceGrid.appendChild(d);
  }
}

function backToStadium(){
  raceView.classList.add("hidden");
  stadiumView.classList.remove("hidden");
}

function openDetail(race){
  currentRace = race;
  raceView.classList.add("hidden");
  detailView.classList.remove("hidden");
  document.getElementById("detailHeader").textContent =
    `${currentStadium} ${race}R`;

  renderPlayers();
  renderExpectation();
  analyze();
}

function backToRace(){
  detailView.classList.add("hidden");
  raceView.classList.remove("hidden");
}

function renderPlayers(){
  const p = document.getElementById("players");
  p.innerHTML = "";

  for(let c=1;c<=6;c++){
    const box = document.createElement("div");
    box.className="course-box";
    box.innerHTML = `
      <div class="course-title">${c}コース</div>
      選手番号 <input type="number">
      <div id="bars${c}"></div>
    `;
    p.appendChild(box);
    renderBars(c);
  }
}

function renderBars(c){
  const el = document.getElementById(`bars${c}`);
  let types = c===1
    ?["逃げ","差され","捲られ","捲り差され"]
    :c===2
    ?["逃がし","差し","捲り"]
    :["差し","捲り","捲り差し"];

  types.forEach(t=>{
    const v = Math.floor(Math.random()*40)+10;
    el.innerHTML += `
      <div class="bar">
        <div class="bar-fill" style="width:${v}%;background:${colors[c]}"></div>
        <div class="bar-text">${t} ${v}%</div>
      </div>
    `;
  });
}

function renderExpectation(){
  const e = document.getElementById("expectation");
  e.innerHTML="";
  for(let c=1;c<=6;c++){
    const v = Math.floor(Math.random()*50)+20;
    e.innerHTML += `
      <div class="expect-bar">
        ${c}コース
        <div class="expect-fill"
          style="width:${v}%;background:${colors[c]};margin-left:6px">
        </div> ${v}%
      </div>
    `;
  }
}

function analyze(){
  document.getElementById("analysisText").textContent =
    "4・5コースが攻めの中心。内はスタート不安。2コース差し残り注意。";

  document.getElementById("betsText").innerHTML =
    "4-2-5<br>4-2-6<br>5-2-4<br>5-2-6";
}