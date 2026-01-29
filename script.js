// ===============================
// 24場名
// ===============================
const stadiums=[
"桐生","戸田","江戸川","平和島","多摩川","浜名湖","蒲郡","常滑",
"津","三国","びわこ","住之江","尼崎","鳴門","丸亀","児島",
"宮島","徳山","下関","若松","芦屋","福岡","唐津","大村"
];

let selectedStadium=0;

// ===============================
// 初期画面生成
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
 d.onclick=()=>selectRace();
 raceGrid.appendChild(d);
}

document.getElementById("backBtn").onclick=()=>{
 document.getElementById("raceScreen").classList.add("hidden");
 document.getElementById("stadiumScreen").classList.remove("hidden");
};

// ===============================
// 画面遷移
// ===============================
function selectStadium(i){
 selectedStadium=i;
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
// 過去傾向ダミー
// ===============================
const pastTrend=[
[60,55,50,45,40,35],[58,52,48,44,40,36],[55,50,48,45,42,38],[62,57,52,48,43,38],
[59,54,49,45,41,36],[56,52,48,44,40,35],[61,56,51,46,42,38],[58,53,49,45,41,36],
[55,50,46,43,40,35],[62,57,52,47,43,38],[59,54,49,45,41,36],[56,51,47,44,40,35],
[61,56,52,47,43,38],[58,53,49,45,41,36],[55,50,46,43,40,35],[62,57,52,47,43,38],
[59,54,49,45,41,36],[56,51,47,44,40,35],[61,56,52,47,43,38],[58,53,49,45,41,36],
[55,50,46,43,40,35],[62,57,52,47,43,38],[59,54,49,45,41,36],[56,51,47,44,40,35]
];

// ===============================
// メイン計算
// ===============================
function calcAll(){

 let base=[],predict=[],ai=[];
 const trend=pastTrend[selectedStadium];

 for(let i=0;i<6;i++){

  const b=Math.floor(40+Math.random()*40);
  const p=Math.floor(35+Math.random()*45);

  const wBase=0.35+Math.random()*0.1;
  const wPred=1-wBase;

  const rawAI=b*wBase+p*wPred;

  const corrected=Math.round(rawAI*0.8 + trend[i]*0.2);

  base.push(b);
  predict.push(p);
  ai.push(corrected);
 }

 updateExpectationBars(base,predict,ai);
 updateKimarite();
 updateRaceTypeByAI(ai);
 updateAnalysis(ai);

 updateBets(ai);
 updateHoleBets(ai);

 updateHitRateSimulation(base,predict,ai);

 updateTrustMeterFinal(ai);
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
   bar.style.width=v+"%";
   bar.style.background=colors[i];
   bar.style.border="1px solid #000";

   const text=document.createElement("span");
   text.className="bar-text";
   text.textContent=v+"%";

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
 document.querySelectorAll(".kimarite-row").forEach(r=>{
  const v=Math.floor(10+Math.random()*75);
  r.querySelector(".bar div").style.width=v+"%";
  r.querySelector(".value").textContent=v+"%";
 });
}

// ===============================
// 展開タイプ
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
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const main=sorted[0].i;
 const sub=sorted[1].i;

 let text="";

 if(main===1) text="1コースが主導。イン優勢展開。";
 else if(main<=3) text="中枠中心で展開変動。";
 else text="外枠伸び優勢で波乱含み。";

 text+=`\n軸候補${main}コース、対抗${sub}コース。`;

 document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目（本命・対抗・逃げ）
// ===============================
function updateBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

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

 const others=[1,2,3,4,5,6].filter(n=>n!==1);

 setCol(cols[2],[
 `1-${others[0]}-${others[1]}`,
 `1-${others[1]}-${others[0]}`,
 `1-${others[2]}-${others[3]}`
 ]);
}

// ===============================
// 穴買い目
// ===============================
function updateHoleBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const used=[sorted[0].i,sorted[1].i,sorted[2].i];

 const holes=[1,2,3,4,5,6].filter(n=>!used.includes(n));

 const col=document.querySelectorAll(".bet-col")[3];

 setCol(col,[
 `${holes[0]}-${holes[1]}-${holes[2]}`,
 `${holes[0]}-${holes[2]}-${holes[1]}`,
 `${holes[1]}-${holes[0]}-${holes[2]}`
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

  const rate=Math.round((base[i]+predict[i]+ai[i])/3);

  row.style.display="flex";
  row.style.alignItems="center";

  const val=row.querySelector(".hitrate-value");
  const outer=row.querySelector(".hitrate-bar");
  const bar=outer.querySelector("div");

  val.textContent=rate+"%";
  val.style.width="50px";
  val.style.textAlign="right";
  val.style.marginRight="8px";

  outer.style.flex="1";
  outer.style.height="14px";
  outer.style.border="1px solid #333";
  outer.style.background=light[i];
  outer.style.borderRadius="4px";

  bar.style.height="100%";
  bar.style.width=rate+"%";
  bar.style.background=colors[i];
  bar.style.border="1px solid #000";
 });
}

// ===============================
// 信頼度メーター（最終統合）
// ===============================
function updateTrustMeterFinal(ai){

 const max=Math.max(...ai);
 const min=Math.min(...ai);
 const avg=Math.round(ai.reduce((a,b)=>a+b,0)/6);

 let solidity=Math.round((max-min)*1.4);
 if(solidity>100)solidity=100;

 let volatility=Math.round((100-solidity)*0.8);

 let trust=avg - volatility*0.3;
 if(trust<0)trust=0;
 if(trust>100)trust=100;

 let box=document.getElementById("confidenceSection");

 if(!box){
  box=document.createElement("section");
  box.id="confidenceSection";
  document.getElementById("playerScreen").appendChild(box);
 }

 box.innerHTML=`
 <h2>信頼度メーター</h2>

 <div class="confidence-row" style="display:flex;align-items:center;margin-bottom:6px;">
  <span style="width:120px;">堅さスコア</span>
  <div style="flex:1;height:14px;border:1px solid #333;background:#eee;margin:0 8px;">
   <div style="width:${solidity}%;height:100%;background:#33cc66;border:1px solid #000;"></div>
  </div>
  <span>${solidity}%</span>
 </div>

 <div class="confidence-row" style="display:flex;align-items:center;margin-bottom:6px;">
  <span style="width:120px;">荒れ指数</span>
  <div style="flex:1;height:14px;border:1px solid #333;background:#ffe5e5;margin:0 8px;">
   <div style="width:${volatility}%;height:100%;background:#ff3333;border:1px solid #000;"></div>
  </div>
  <span>${volatility}</span>
 </div>

 <div class="confidence-row" style="display:flex;align-items:center;">
  <span style="width:120px;">総合信頼度</span>
  <div style="flex:1;height:14px;border:1px solid #333;background:#fff7cc;margin:0 8px;">
   <div style="width:${trust}%;height:100%;background:#ffcc00;border:1px solid #000;"></div>
  </div>
  <span>${trust}%</span>
 </div>
 `;
}