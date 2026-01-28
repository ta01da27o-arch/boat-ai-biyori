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
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent=stadiums[i];
}

function selectRace(){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");
  calcAll();
}

// ===============================
// B①標準AI補正値（ガチAI風）
// ===============================
const courseBias = [15,5,0,-5,-10,-15];   // イン有利補正
const spreadBias = [0,2,4,6,8,10];        // 外伸び補正

// ===============================
// メイン計算
// ===============================
function calcAll(){

  let base=[];
  let predict=[];
  let ai=[];

  for(let i=0;i<6;i++){

    const performance = 40 + Math.random()*35;
    const forecast    = 35 + Math.random()*40;

    base.push(Math.round(performance));
    predict.push(Math.round(forecast));

    // --- ガチAI風合成 ---
    let aiValue =
      performance * 0.35 +
      forecast * 0.45 +
      courseBias[i] +
      spreadBias[i] * (Math.random()*0.6);

    // ブレ幅（現実的ノイズ）
    aiValue += (Math.random()*8 - 4);

    aiValue = Math.max(10,Math.min(95,Math.round(aiValue)));

    ai.push(aiValue);
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

    [base[i],predict[i],ai[i]].forEach((val,j)=>{

      const line=document.createElement("div");
      line.className="bar-line";

      const label=document.createElement("span");
      label.className="bar-label";
      label.textContent=labels[j];

      const outer=document.createElement("div");
      outer.style.flex="1";
      outer.style.height="14px";
      outer.style.border="1px solid #333";
      outer.style.background=getLightColor(i);
      outer.style.position="relative";
      outer.style.borderRadius="4px";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=val+"%";
      bar.style.background=colors[i];
      bar.style.border=(i===0)?"2px solid #000":"1px solid #000";
      bar.style.boxSizing="border-box";

      const text=document.createElement("span");
      text.className="bar-text";
      text.textContent=val+"%";

      outer.appendChild(bar);
      outer.appendChild(text);

      line.appendChild(label);
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
// 展開タイプ（AI補正反映）
// ===============================
function updateRaceTypeByAI(ai){

  const inner=ai[0];
  const middle=(ai[1]+ai[2]+ai[3])/3;
  const outer=(ai[4]+ai[5])/2;

  let type="";

  if(inner>middle+12) type="イン逃げ主導型";
  else if(middle>outer+5) type="中枠主導型";
  else if(outer>inner+8) type="外伸び波乱型";
  else type="混戦型";

  document.getElementById("race-type").textContent="展開タイプ : "+type;
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

  const order=ai.map((v,i)=>({v,i:i+1}))
                .sort((a,b)=>b.v-a.v);

  const main=order[0].i;
  const sub=order[1].i;

  let text="";

  if(main===1) text="イン主導で堅め展開の可能性大。";
  else if(main<=3) text="中枠の攻めがレースを動かす展開。";
  else text="外枠の伸びが波乱を演出。";

  text+=`\n軸候補は ${main}コース。対抗は ${sub}コース。`;

  document.querySelector(".analysis-text").textContent=text;
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

  const cols=document.querySelectorAll(".bet-col");

  setCol(cols[0],[
    `${main}-${sub}-${third}`,
    `${main}-${third}-${sub}`,
    `${sub}-${main}-${third}`
  ]);

  setCol(cols[1],[
    `${sub}-${main}-${third}`,
    `${third}-${main}-${sub}`,
    `${sub}-${third}-${main}`
  ]);

  setCol(cols[2],[
    `1-2-3`,
    `1-3-2`,
    `1-4-5`
  ]);
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

  const colors=["#fff","#000","#ff3333","#3366ff","#ffcc00","#33cc66"];
  const light=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"];

  rows.forEach((row,i)=>{

    const hit=Math.round((base[i]+predict[i]+ai[i])/3);

    const value=row.querySelector(".hitrate-value");
    const outer=row.querySelector(".hitrate-bar");
    const bar=row.querySelector(".hitrate-bar div");

    row.style.display="flex";
    row.style.alignItems="center";

    value.textContent=hit+"%";
    value.style.width="50px";
    value.style.textAlign="right";
    value.style.marginRight="8px";

    outer.style.flex="1";
    outer.style.height="14px";
    outer.style.border="1px solid #333";
    outer.style.background=light[i];
    outer.style.borderRadius="4px";

    bar.style.height="100%";
    bar.style.width=hit+"%";
    bar.style.background=colors[i];
    bar.style.border="1px solid #000";
    bar.style.boxSizing="border-box";
  });
}