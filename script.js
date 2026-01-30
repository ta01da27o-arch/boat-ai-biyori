// ===============================
// 24場名
// ===============================
const stadiums=[
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
const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");

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
const pastTrend=[
[60,50,45,40,35,30],[55,50,50,45,40,35],[50,45,50,40,35,30],[60,55,50,45,40,35],
[55,50,45,40,35,30],[50,45,40,35,30,25],[60,55,50,45,40,35],[55,50,45,40,35,30],
[50,45,40,35,30,25],[60,55,50,45,40,35],[55,50,45,40,35,30],[50,45,40,35,30,25],
[60,55,50,45,40,35],[55,50,45,40,35,30],[50,45,40,35,30,25],[60,55,50,45,40,35],
[55,50,45,40,35,30],[50,45,40,35,30,25],[60,55,50,45,40,35],[55,50,45,40,35,30],
[50,45,40,35,30,25],[60,55,50,45,40,35],[55,50,45,40,35,30],[50,45,40,35,30,25]
];

// ===============================
// メイン計算
// ===============================
function calcAllWithTrend(stadiumIndex){

 let base=[];
 let predict=[];
 let ai=[];

 const trend=pastTrend[stadiumIndex];

 for(let i=0;i<6;i++){

  const b=Math.floor(40+Math.random()*40);
  const p=Math.floor(35+Math.random()*45);

  const courseBonus=[15,8,3,0,-3,-6][i];

  const t=trend[i];

  const a=Math.round(
   b*0.35+
   p*0.35+
   t*0.2+
   courseBonus
  );

  base.push(b);
  predict.push(p);
  ai.push(Math.max(0,Math.min(100,a)));
 }

 updateExpectationBars(base,predict,ai);
 updateKimarite(ai);
 updateRaceTypeByAI(ai);
 updateAnalysis(ai);
 updateBets(ai);
 updateHoleBets(ai);
 updateHitRateSimulation(base,predict,ai);
 updateTrustMeter(ai);
}

// ===============================
// 総合期待度バー（完全復活版）
// ===============================
function updateExpectationBars(base,predict,ai){

 document.querySelectorAll(".expectation-row").forEach((row,i)=>{

  const fills=row.querySelectorAll(".bar-fill");

  if(fills[0]) fills[0].style.width=base[i]+"%";
  if(fills[1]) fills[1].style.width=predict[i]+"%";
  if(fills[2]) fills[2].style.width=ai[i]+"%";

  row.querySelector(".expectation-value").textContent=ai[i]+"%";
 });
}

// ===============================
// 決まり手（NaN対策込み）
// ===============================
function updateKimarite(ai){

 document.querySelectorAll(".kimarite-row").forEach((row,i)=>{

  let v=Math.round(ai[i]*0.8+Math.random()*15);

  if(isNaN(v)) v=0;
  if(v>100) v=100;

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
// 展開解析コメント
// ===============================
function updateAnalysis(ai){

 const order=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const main=order[0].i;
 const sub=order[1].i;
 const low=order[5].i;

 let text="";

 text+=`${main}コースが展開の中心。主導権を握る可能性が高い。\n`;
 text+=`${sub}コースが巧く続き、連対候補。\n`;
 text+=`${low}コースは伸び欠き苦戦気配。\n`;

 if(main===1) text+="イン逃げ濃厚な流れ。";
 else if(main>=5) text+="外枠の一撃注意。";
 else text+="中枠主導で波乱含み。";

 document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目
// ===============================
function updateBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const a=sorted[0].i;
 const b=sorted[1].i;
 const c=sorted[2].i;
 const d=sorted[3].i;

 const cols=document.querySelectorAll(".bet-col");

 if(cols[0]) setCol(cols[0],[`${a}-${b}-${c}`,`${a}-${c}-${b}`,`${b}-${a}-${c}`]);
 if(cols[1]) setCol(cols[1],[`${b}-${c}-${d}`,`${b}-${d}-${c}`,`${c}-${b}-${d}`]);
 if(cols[2]) setCol(cols[2],[`1-${b}-${c}`,`1-${c}-${b}`,`1-${b}-${d}`]);
}

function updateHoleBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const low=sorted.slice(3).map(o=>o.i);

 const cols=document.querySelectorAll(".bet-col");

 if(cols[3]){
  setCol(cols[3],[`${low[0]}-${low[1]}-${low[2]}`,`${low[0]}-${low[2]}-${low[1]}`,`${low[1]}-${low[0]}-${low[2]}`]);
 }
}

function setCol(col,arr){
 const items=col.querySelectorAll(".bet-item");
 items.forEach((el,i)=>el.textContent=arr[i]||"");
}

// ===============================
// 的中率
// ===============================
function updateHitRateSimulation(base,predict,ai){

 document.querySelectorAll(".hitrate-row").forEach((row,i)=>{

  const rate=Math.round((base[i]+predict[i]+ai[i])/3);

  row.querySelector(".hitrate-value").textContent=rate+"%";
  row.querySelector(".hitrate-bar div").style.width=rate+"%";
 });
}

// ===============================
// 信頼度メーター
// ===============================
function updateTrustMeter(ai){

 const max=Math.max(...ai);
 const min=Math.min(...ai);

 const solidity=Math.round((max-min)*1.5);

 const avg=ai.reduce((a,b)=>a+b,0)/6;
 const variance=Math.round(ai.reduce((s,v)=>s+Math.abs(v-avg),0)/6*1.8);

 let trust=solidity-variance*0.6;
 trust=Math.max(0,Math.min(100,Math.round(trust)));

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
