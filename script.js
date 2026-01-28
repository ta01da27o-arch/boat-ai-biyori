// ===============================
// 24場名（正式）
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
// 過去傾向データ（A）
// ===============================
const trendData = {
  "桐生":[8,2,1,0,0,0],
  "戸田":[5,3,2,1,0,0],
  "江戸川":[3,4,3,2,1,0],
  "平和島":[6,3,2,1,0,0],
  "多摩川":[7,3,2,1,0,0],
  "浜名湖":[6,3,2,1,0,0],
  "蒲郡":[8,2,1,0,0,0],
  "常滑":[7,3,2,1,0,0],
  "津":[6,3,2,1,0,0],
  "三国":[5,4,3,1,0,0],
  "びわこ":[4,4,3,2,1,0],
  "住之江":[6,3,2,1,0,0],
  "尼崎":[6,3,2,1,0,0],
  "鳴門":[5,4,3,1,0,0],
  "丸亀":[7,3,2,1,0,0],
  "児島":[6,3,2,1,0,0],
  "宮島":[5,4,3,1,0,0],
  "徳山":[6,3,2,1,0,0],
  "下関":[7,3,2,1,0,0],
  "若松":[6,3,2,1,0,0],
  "芦屋":[8,2,1,0,0,0],
  "福岡":[6,3,2,1,0,0],
  "唐津":[7,3,2,1,0,0],
  "大村":[9,2,1,0,0,0]
};

let currentStadium = "";

// ===============================
// 初期表示
// ===============================
const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

stadiums.forEach((name,i)=>{
  const div=document.createElement("div");
  div.className="stadium";
  div.textContent=name;
  div.onclick=()=>selectStadium(i);
  stadiumGrid.appendChild(div);
});

for(let i=1;i<=12;i++){
  const div=document.createElement("div");
  div.className="race";
  div.textContent=i+"R";
  div.onclick=()=>selectRace(i);
  raceGrid.appendChild(div);
}

document.getElementById("backBtn").onclick=()=>{
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("stadiumScreen").classList.remove("hidden");
};

// ===============================
// 画面遷移
// ===============================
function selectStadium(i){
  currentStadium = stadiums[i];
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent=currentStadium;
}

function selectRace(r){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");
  calcAll();
}

// ===============================
// メイン計算
// ===============================
function calcAll(){

  let base=[];
  let predict=[];
  let ai=[];

  for(let i=0;i<6;i++){
    const b = Math.floor(40+Math.random()*40);
    const p = Math.floor(35+Math.random()*45);
    const a = Math.round(b*0.4 + p*0.6);

    base.push(b);
    predict.push(p);
    ai.push(a);
  }

  applyTrend(base,predict,ai);

  updateExpectationBars(base,predict,ai);
  updateKimarite();
  updateRaceTypeByAI(ai);
  updateAnalysis(ai);
  updateBets(ai);
  updateHitRateSimulation(base,predict,ai);
}

// ===============================
// 過去傾向反映ロジック（A）
// ===============================
function applyTrend(base,predict,ai){

  if(!trendData[currentStadium]) return;

  const trend = trendData[currentStadium];

  for(let i=0;i<6;i++){
    base[i] += trend[i];
    predict[i] += Math.floor(trend[i]*0.7);
    ai[i] += trend[i];

    if(base[i]>100) base[i]=100;
    if(predict[i]>100) predict[i]=100;
    if(ai[i]>100) ai[i]=100;
  }
}

// ===============================
// 総合期待度（そのまま）
// ===============================
function updateExpectationBars(base,predict,ai){

  const colors = ["#ffffff","#000000","#ff3333","#3366ff","#ffcc00","#33cc66"];
  const japaneseLabels = ["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{
    const barBox = row.querySelector(".expectation-bar");
    barBox.innerHTML="";

    const values = [base[i], predict[i], ai[i]];

    values.forEach((val,j)=>{
      const line=document.createElement("div");
      line.className="bar-line";

      const label=document.createElement("span");
      label.className="bar-label";
      label.textContent=japaneseLabels[j];

      const outer=document.createElement("div");
      outer.style.flex="1";
      outer.style.height="14px";
      outer.style.border="1px solid #333";
      outer.style.background=getLightColor(i);
      outer.style.position="relative";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=val+"%";
      bar.style.background=colors[i];
      bar.style.border=(i===0)?"2px solid #000":"1px solid #000";

      const txt=document.createElement("span");
      txt.className="bar-text";
      txt.textContent=val+"%";

      outer.appendChild(bar);
      outer.appendChild(txt);
      line.appendChild(label);
      line.appendChild(outer);
      barBox.appendChild(line);
    });

    row.querySelector(".expectation-value").textContent=ai[i]+"%";
  });
}

function getLightColor(i){
  return ["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"][i];
}

// ===============================
// 決まり手
// ===============================
function updateKimarite(){
  document.querySelectorAll(".kimarite-row").forEach(row=>{
    const v=Math.floor(10+Math.random()*75);
    row.querySelector(".bar div").style.width=v+"%";
    row.querySelector(".value").textContent=v+"%";
  });
}

// ===============================
// 展開タイプ
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
// 展開解析
// ===============================
function updateAnalysis(ai){

  const order=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=order[0].i;
  const sub=order[1].i;

  let text="";

  if(main===1) text="1コースが主導権。イン有利展開。";
  else if(main<=3) text="中枠中心で展開が動く。";
  else text="外枠の伸び優勢。波乱注意。";

  text+=`\n軸候補は ${main}コース。対抗は ${sub}コース。`;

  document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目（あなたの完成版そのまま）
// ===============================
function updateBets(ai){

  const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=sorted[0].i;
  const sub=sorted[1].i;
  const third=sorted[2].i;

  const others=[1,2,3,4,5,6].filter(n=>n!==1);

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
// 的中率シミュレーション
// ===============================
function updateHitRateSimulation(base,predict,ai){

  const rows=document.querySelectorAll("#hitRateSection .hitrate-row");
  const colors=["#ffffff","#000000","#ff3333","#3366ff","#ffcc00","#33cc66"];

  rows.forEach((row,i)=>{
    const rate=Math.round((base[i]+predict[i]+ai[i])/3);
    row.querySelector(".hitrate-value").textContent=rate+"%";
    const bar=row.querySelector(".hitrate-bar div");
    bar.style.width=rate+"%";
    bar.style.background=colors[i];
  });
}