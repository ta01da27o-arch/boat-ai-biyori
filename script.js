// ===============================
// 24場名
// ===============================
const stadiums = [
  "桐生","戸田","江戸川","平和島",
  "多摩川","浜名湖","蒲郡","常滑",
  "津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島",
  "宮島","徳山","下関","若松",
  "芦屋","福岡","唐津","大村"
];

// ===============================
// 過去場別傾向（A 仮データ）
// ===============================
const trendData = {
  "大村":[12,6,4,2,1,1],
  "住之江":[9,7,5,3,2,1],
  "平和島":[6,7,6,4,3,2],
  "戸田":[4,6,7,6,4,3],
  "江戸川":[3,5,6,6,5,4]
};

// ===============================
const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");

stadiums.forEach((name,i)=>{
  const d=document.createElement("div");
  d.className="stadium";
  d.textContent=name;
  d.onclick=()=>selectStadium(i);
  stadiumGrid.appendChild(d);
});

for(let i=1;i<=12;i++){
  const d=document.createElement("div");
  d.className="race";
  d.textContent=i+"R";
  d.onclick=()=>selectRace(i);
  raceGrid.appendChild(d);
}

document.getElementById("backBtn").onclick=()=>{
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("stadiumScreen").classList.remove("hidden");
};

let selectedStadium="";

// ===============================
function selectStadium(i){
  selectedStadium=stadiums[i];
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent=selectedStadium;
}

function selectRace(){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");
  calcAll();
}

// ===============================
// メイン計算
// ===============================
function calcAll(){

  let base=[],predict=[],ai=[];

  const trend = trendData[selectedStadium] || [0,0,0,0,0,0];

  for(let i=0;i<6;i++){

    const b = Math.floor(40+Math.random()*40);
    const p = Math.floor(35+Math.random()*45);

    const trendBoost = trend[i]*1.5;

    const a = Math.round(b*0.3 + p*0.5 + trendBoost);

    base.push(b);
    predict.push(p);
    ai.push(Math.min(a,100));
  }

  updateExpectationBars(base,predict,ai);
  updateKimarite();
  updateRaceTypeByAI(ai);
  updateAnalysis(ai);
  updateBets(ai);
  updateHitRateSimulation(base,predict,ai);
}

// ===============================
// 総合期待度
// ===============================
function updateExpectationBars(base,predict,ai){

  const colors=["#fff","#000","#ff3333","#3366ff","#ffcc00","#33cc66"];
  const labels=["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    [base[i],predict[i],ai[i]].forEach((v,j)=>{

      const line=document.createElement("div");
      line.className="bar-line";

      const lab=document.createElement("span");
      lab.className="bar-label";
      lab.textContent=labels[j];

      const outer=document.createElement("div");
      outer.style.flex="1";
      outer.style.height="14px";
      outer.style.border="1px solid #333";
      outer.style.background=getLightColor(i);
      outer.style.position="relative";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=v+"%";
      bar.style.background=colors[i];
      bar.style.border="1px solid #000";

      const txt=document.createElement("span");
      txt.className="bar-text";
      txt.textContent=v+"%";

      outer.appendChild(bar);
      outer.appendChild(txt);

      line.appendChild(lab);
      line.appendChild(outer);
      box.appendChild(line);
    });

    row.querySelector(".expectation-value").textContent=ai[i]+"%";
  });
}

function getLightColor(i){
  return ["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"][i];
}

// ===============================
function updateKimarite(){
  document.querySelectorAll(".kimarite-row").forEach(r=>{
    const v=Math.floor(10+Math.random()*75);
    r.querySelector(".bar div").style.width=v+"%";
    r.querySelector(".value").textContent=v+"%";
  });
}

// ===============================
function updateRaceTypeByAI(ai){

  const inner=ai[0];
  const middle=(ai[1]+ai[2]+ai[3])/3;
  const outer=(ai[4]+ai[5])/2;

  let type="";

  if(inner>middle+10&&inner>outer+15) type="イン逃げ主導型";
  else if(middle>inner&&middle>outer) type="中枠攻め合い型";
  else if(outer>inner&&outer>middle) type="外伸び波乱型";
  else type="バランス型";

  document.getElementById("race-type").textContent="展開タイプ : "+type;
}

// ===============================
function updateAnalysis(ai){

  const rank=ai.map((v,i)=>({v,i:i+1}))
               .sort((a,b)=>b.v-a.v);

  let txt="";

  if(rank[0].i===1) txt="1コースが主導権を握る展開。";
  else if(rank[0].i<=3) txt="中枠中心の攻防戦。";
  else txt="外枠浮上の波乱展開。";

  txt+=`\n軸:${rank[0].i} 対抗:${rank[1].i}`;

  document.querySelector(".analysis-text").textContent=txt;
}

// ===============================
// 買い目（完成版維持）
// ===============================
function updateBets(ai){

  const sorted=ai.map((v,i)=>({v,i:i+1}))
                 .sort((a,b)=>b.v-a.v);

  const main=sorted[0].i;
  const sub=sorted[1].i;
  const third=sorted[2].i;

  const others=[2,3,4,5,6];

  const cols=document.querySelectorAll(".bet-col");

  setCol(cols[0],[`${main}-${sub}-${third}`,`${main}-${third}-${sub}`,`${sub}-${main}-${third}`]);

  setCol(cols[1],[`${sub}-${main}-${third}`,`${third}-${main}-${sub}`,`${sub}-${third}-${main}`]);

  setCol(cols[2],[`1-${others[0]}-${others[1]}`,`1-${others[1]}-${others[0]}`,`1-${others[2]}-${others[3]}`]);
}

function setCol(col,arr){
  col.querySelectorAll(".bet-item").forEach((el,i)=>{
    el.textContent=arr[i]||"";
  });
}

// ===============================
// 的中率シミュレーション（グラフ復活版）
// ===============================
function updateHitRateSimulation(base,predict,ai){

  const colors=["#fff","#000","#ff3333","#3366ff","#ffcc00","#33cc66"];

  document.querySelectorAll("#hitRateSection .hitrate-row")
    .forEach((row,i)=>{

      const rate=Math.round((base[i]+predict[i]+ai[i])/3);

      const value=row.querySelector(".hitrate-value");
      const bar=row.querySelector(".hitrate-bar div");

      value.textContent=rate+"%";
      bar.style.width=rate+"%";
      bar.style.height="100%";
      bar.style.background=colors[i];
    });
}