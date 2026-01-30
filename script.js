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

// ===============================
// 画面遷移
// ===============================
let currentStadiumIndex=0;

function selectStadium(i){
 currentStadiumIndex=i;
 document.getElementById("stadiumScreen").classList.add("hidden");
 document.getElementById("raceScreen").classList.remove("hidden");
 document.getElementById("raceTitle").textContent=stadiums[i];
}

function selectRace(){
 document.getElementById("raceScreen").classList.add("hidden");
 document.getElementById("playerScreen").classList.remove("hidden");
 calcAllWithTrend(currentStadiumIndex);
}

// ===============================
// 過去傾向ダミー
// ===============================
const pastTrend = Array.from({length:24},()=>[
 60,55,50,45,40,35
]);

// ===============================
// メイン計算
// ===============================
function calcAllWithTrend(stadiumIndex){

 let base=[],predict=[],ai=[];
 const trend=pastTrend[stadiumIndex];

 for(let i=0;i<6;i++){

  const courseBias=[25,15,10,5,3,2][i]; // 実戦コース補正

  const performance=Math.floor(35+Math.random()*40);
  const envEffect=Math.floor(20+Math.random()*40);
  const trendScore=trend[i];

  const realBase = Math.round(
    performance*0.5 +
    trendScore*0.3 +
    courseBias*0.2
  );

  const realPredict = Math.round(
    envEffect*0.5 +
    trendScore*0.3 +
    courseBias*0.2
  );

  const realAI = Math.round(
    realBase*0.4 +
    realPredict*0.4 +
    courseBias*0.2
  );

  base.push(limit(realBase));
  predict.push(limit(realPredict));
  ai.push(limit(realAI));
 }

 updateExpectationBars(base,predict,ai);
 updateKimarite(base);
 updateRaceTypeByAI(ai);
 updateAnalysis(ai);
 updateBets(ai);
 updateHoleBets(ai);
 updateHitRateSimulation(base,predict,ai);
 updateTrustMeter(ai);
}

function limit(v){
 if(v<1) return 1;
 if(v>100) return 100;
 return v;
}

// ===============================
// 総合期待度（完成UI構造復元）
// ===============================
function updateExpectationBars(base,predict,ai){

 const colors=["#fff","#000","#ff3333","#3366ff","#ffcc00","#33cc66"];
 const light=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"];
 const labels=["実績","予測","AI"];

 document.querySelectorAll(".expectation-row").forEach((row,i)=>{

  const box=row.querySelector(".expectation-bar");
  box.innerHTML="";

  [base[i],predict[i],ai[i]].forEach((val,j)=>{

   const line=document.createElement("div");
   line.className="bar-line";

   const lab=document.createElement("span");
   lab.className="bar-label";
   lab.textContent=labels[j];

   const outer=document.createElement("div");
   outer.className="bar-outer";
   outer.style.background=light[i];
   outer.style.border="1px solid #333";

   const bar=document.createElement("div");
   bar.className="bar-inner";
   bar.style.width=val+"%";
   bar.style.background=colors[i];
   bar.style.border="1px solid #000";

   outer.appendChild(bar);
   line.appendChild(lab);
   line.appendChild(outer);

   box.appendChild(line);
  });

  // 右端総合％のみ
  row.querySelector(".expectation-value").textContent=ai[i]+"%";
 });
}

// ===============================
// 決まり手（実績連動）
// ===============================
function updateKimarite(base){
 document.querySelectorAll(".kimarite-row").forEach((row,i)=>{
  const v=Math.round(base[i]*0.9 + Math.random()*10);
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

 if(inner>middle+10 && inner>outer+15) type="イン逃げ主導型";
 else if(middle>inner && middle>outer) type="中枠攻め合い型";
 else if(outer>inner && outer>middle) type="外伸び波乱型";
 else if(Math.max(...ai)-Math.min(...ai)<8) type="超混戦型";
 else type="バランス型";

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

 if(main===1) text="1コースが主導権。イン有利展開。";
 else if(main<=3) text="中枠中心で流れが動く。";
 else text="外枠優勢で波乱含み。";

 text+=`\n軸は${main}コース、対抗${sub}コース。`;

 document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目
// ===============================
function updateBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1}))
                .sort((a,b)=>b.v-a.v);

 const m1=sorted[0].i;
 const m2=sorted[1].i;
 const m3=sorted[2].i;

 const others=[1,2,3,4,5,6].filter(n=>![m1,m2,m3].includes(n));

 const cols=document.querySelectorAll(".bet-col");

 if(cols.length>=3){

  setCol(cols[0],[`${m1}-${m2}-${m3}`,`${m1}-${m3}-${m2}`,`${m2}-${m1}-${m3}`]);

  setCol(cols[1],[`${m2}-${m3}-${others[0]}`,`${m2}-${m3}-${others[1]}`,`${m2}-${m3}-${others[2]}`]);

  setCol(cols[2],[`1-${m2}-${m3}`,`1-${m3}-${m2}`,`1-${m2}-${others[0]}`]);
 }
}

function updateHoleBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1}))
                .sort((a,b)=>b.v-a.v);

 const others=[1,2,3,4,5,6].filter(n=>![sorted[0].i,sorted[1].i,sorted[2].i].includes(n));

 const cols=document.querySelectorAll(".bet-col");

 if(cols.length>=4){
  setCol(cols[3],[
   `${others[0]}-${others[1]}-${others[2]}`,
   `${others[1]}-${others[0]}-${others[2]}`,
   `${others[2]}-${others[0]}-${others[1]}`
  ]);
 }
}

function setCol(col,arr){
 const items=col.querySelectorAll(".bet-item");
 items.forEach((el,i)=>el.textContent=arr[i]||"");
}

// ===============================
// 的中率シミュレーション（完成UI復元）
// ===============================
function updateHitRateSimulation(base,predict,ai){

 const rows=document.querySelectorAll("#hitRateSection .hitrate-row");

 const colors=["#fff","#000","#ff3333","#3366ff","#ffcc00","#33cc66"];
 const light=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"];

 rows.forEach((row,i)=>{

  const rate=Math.round((base[i]+predict[i]+ai[i])/3);

  const value=row.querySelector(".hitrate-value");
  const outer=row.querySelector(".hitrate-bar");
  const bar=outer.querySelector("div");

  value.textContent=rate+"%";

  outer.style.background=light[i];
  outer.style.border="1px solid #333";

  bar.style.width=rate+"%";
  bar.style.background=colors[i];
  bar.style.border="1px solid #000";
 });
}

// ===============================
// 信頼度メーター
// ===============================
function updateTrustMeter(ai){

 const max=Math.max(...ai);
 const min=Math.min(...ai);
 const avg=ai.reduce((a,b)=>a+b,0)/6;

 let solidity=Math.round((max-min)*1.5);
 let variance=Math.round(ai.reduce((s,v)=>s+Math.abs(v-avg),0)/6*1.8);

 solidity=Math.min(100,solidity);
 variance=Math.min(100,variance);

 let trust=Math.round(solidity-variance*0.6);
 if(trust<0) trust=0;
 if(trust>100) trust=100;

 let box=document.getElementById("trustMeter");

 if(!box){
  box=document.createElement("div");
  box.id="trustMeter";
  document.getElementById("playerScreen").appendChild(box);
 }

 box.innerHTML=`
  <h2>信頼度メーター</h2>
  <p>堅さスコア：${solidity}</p>
  <p>荒れ指数：${variance}</p>
  <p><strong>総合信頼度：${trust}%</strong></p>
 `;
 }
