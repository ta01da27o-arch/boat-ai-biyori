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

  updateExpectationBars(base,predict,ai);
  updateKimarite();
  const raceType = updateRaceTypeByAI(ai);
  updateAnalysis(ai);
  updateBets(ai);
  updateHitRateSimulation(base,predict,ai,raceType);
}

// ===============================
// 総合期待度
// ===============================
function updateExpectationBars(base,predict,ai){

  const colors=["#ffffff","#000000","#ff3333","#3366ff","#ffcc00","#33cc66"];
  const labels=["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    const values=[base[i],predict[i],ai[i]];

    values.forEach((v,j)=>{

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
      outer.style.borderRadius="4px";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=v+"%";
      bar.style.background=colors[i];
      bar.style.border=(i===0)?"2px solid #000":"1px solid #000";
      bar.style.boxSizing="border-box";

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
// 展開タイプAI
// ===============================
function updateRaceTypeByAI(ai){

  const inner=ai[0];
  const middle=(ai[1]+ai[2]+ai[3])/3;
  const outer=(ai[4]+ai[5])/2;

  const max=Math.max(...ai);
  const min=Math.min(...ai);

  let type="";

  if(inner>middle+10&&inner>outer+15) type="イン逃げ主導型";
  else if(middle>inner&&middle>outer) type="中枠攻め合い型";
  else if(outer>inner&&outer>middle) type="外伸び波乱型";
  else if(max-min<8) type="超混戦型";
  else type="バランス型";

  document.getElementById("race-type").textContent="展開タイプ : "+type;

  return type;
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

  const order=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=order[0].i;
  const sub=order[1].i;

  let text="";

  if(main===1) text="1コースがスタート優勢。イン主導で展開は安定傾向。";
  else if(main<=3) text="中枠勢が主導権争い。展開が動きやすいレース。";
  else text="外枠の伸びが優勢。波乱展開も十分。";

  text+=`\n軸候補は ${main}コース。対抗は ${sub}コース。`;

  document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目（完成版維持）
// ===============================
function updateBets(ai){

  const sorted=[0,1,2,3,4,5].map(i=>({v:ai[i],i:i+1}))
    .sort((a,b)=>b.v-a.v);

  const main=sorted[0].i;
  const sub=sorted[1].i;
  const third=sorted[2].i;

  const cols=document.querySelectorAll(".bet-col");

  setCol(cols[0],[`${main}-${sub}-${third}`,`${main}-${third}-${sub}`,`${sub}-${main}-${third}`]);
  setCol(cols[1],[`${sub}-${third}-${main}`,`${sub}-${main}-${third}`,`${third}-${sub}-${main}`]);
  setCol(cols[2],[`${main}-${sub}-${third}`,`${main}-${third}-${sub}`,`${sub}-${main}-${third}`]);
}

function setCol(col,arr){
  col.querySelectorAll(".bet-item").forEach((el,i)=>{
    el.textContent=arr[i]||"";
  });
}

// ===============================
// 的中率シミュレーション（B①強化版）
// ===============================
function updateHitRateSimulation(base,predict,ai,raceType){

  const container=document.getElementById("hitRateSection");
  if(!container) return;

  container.innerHTML="";

  const colors=["#ffffff","#000000","#ff3333","#3366ff","#ffcc00","#33cc66"];
  const light=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"];

  let rates=[];

  for(let i=0;i<6;i++){
    rates[i]=Math.round((base[i]+predict[i]+ai[i])/3);
  }

  // ===== 展開補正 =====
  if(raceType==="イン逃げ主導型"){
    rates[0]+=5;
  }
  if(raceType==="中枠攻め合い型"){
    rates[1]+=3; rates[2]+=3; rates[3]+=3;
  }
  if(raceType==="外伸び波乱型"){
    rates[4]+=6; rates[5]+=6;
  }

  // ===== 荒れ調整 =====
  const avg=rates.reduce((a,b)=>a+b,0)/6;

  for(let i=0;i<6;i++){
    if(rates[i]>avg+18) rates[i]-=4;
    if(rates[i]<avg-18) rates[i]+=4;
  }

  // ===== 表示 =====
  for(let i=0;i<6;i++){

    if(rates[i]>95) rates[i]=95;
    if(rates[i]<5) rates[i]=5;

    const row=document.createElement("div");
    row.className="hitrate-row";
    row.style.display="flex";
    row.style.alignItems="center";
    row.style.marginBottom="6px";

    const label=document.createElement("span");
    label.style.width="28px";
    label.style.textAlign="right";
    label.style.marginRight="10px";
    label.textContent=(i+1);

    const outer=document.createElement("div");
    outer.style.flex="1";
    outer.style.height="14px";
    outer.style.background=light[i];
    outer.style.border="1px solid #333";
    outer.style.borderRadius="4px";
    outer.style.position="relative";

    const bar=document.createElement("div");
    bar.style.height="100%";
    bar.style.width=rates[i]+"%";
    bar.style.background=colors[i];
    bar.style.border="1px solid #000";
    bar.style.boxSizing="border-box";

    const txt=document.createElement("span");
    txt.className="bar-text";
    txt.textContent=rates[i]+"%";

    outer.appendChild(bar);
    outer.appendChild(txt);

    row.appendChild(label);
    row.appendChild(outer);

    container.appendChild(row);
  }
}