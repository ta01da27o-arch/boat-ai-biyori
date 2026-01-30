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
// 過去傾向
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

 let base=[],predict=[],ai=[];
 const trend=pastTrend[stadiumIndex];

 for(let i=0;i<6;i++){

  const bias=[18,6,2,-3,-8,-12][i];

  let b=Math.round(45+Math.random()*30+bias);
  let p=Math.round(trend[i]+Math.random()*12-6);

  b=Math.min(100,Math.max(1,b));
  p=Math.min(100,Math.max(1,p));

  let a=Math.round(b*0.45+p*0.35+trend[i]*0.2);
  a=Math.min(100,Math.max(1,a));

  base.push(b);
  predict.push(p);
  ai.push(a);
 }

 updateExpectationBars(base,predict,ai);
 updateKimarite(base);
 updateRaceTypeByAI(ai);
 updateAnalysis(ai);
 updateBets(ai);
 updateHitRateSimulation(base,predict,ai);
 updateTrustMeter(ai);
}

// ===============================
// 総合期待度
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
// 決まり手 NaN防止
// ===============================
function updateKimarite(base){

 document.querySelectorAll(".kimarite-row").forEach((row,i)=>{

  let v=Math.round(base[i]*0.85+Math.random()*10);

  if(isNaN(v)) v=0;
  if(v>100) v=100;
  if(v<1) v=1;

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
 else if(Math.max(...ai)-Math.min(...ai)<8) type="超混戦型";
 else type="バランス型";

 document.getElementById("race-type").textContent="展開タイプ : "+type;
}

// ===============================
// 展開解析（記者風リアル版）
// ===============================
function updateAnalysis(ai){

 const order=ai.map((v,i)=>({v,i:i+1}))
               .sort((a,b)=>b.v-a.v);

 const main=order[0].i;
 const sub=order[1].i;
 const third=order[2].i;

 const inner=ai[0];
 const middle=(ai[1]+ai[2]+ai[3])/3;
 const outer=(ai[4]+ai[5])/2;

 let text="";

 // イン有利
 if(inner>middle+10&&inner>outer+15){

  text+=`スタート踏み込む1コースが先マイ体勢。\n`;
  text+=`握って回る${sub}コースが差しで続き、内有利の決着濃厚。\n`;
  text+=`${third}コースは展開待ちで三着争いまで。\n`;
  text+=`外枠勢は展開向かず厳しい一戦となりそうだ。`;

 }

 // 中枠主導
 else if(middle>inner&&middle>outer){

  text+=`${main}コースが果敢に仕掛け主導権を握る展開。\n`;
  text+=`${sub}コースが差し構えで続き内外攻防。\n`;
  text+=`1コースは踏ん張りどころで連下争い。\n`;
  text+=`混戦模様で着順入れ替わり十分。`;

 }

 // 外枠波乱
 else if(outer>inner&&outer>middle){

  text+=`${main}コース中心にダッシュ勢が一気に攻め込む。\n`;
  text+=`内枠勢は対応に苦戦し波乱含み。\n`;
  text+=`高配当も十分狙える展開となりそうだ。`;

 }

 // 混戦
 else if(Math.max(...ai)-Math.min(...ai)<8){

  text+=`スタート横一線の混戦模様。\n`;
  text+=`ターン勝負で着順が目まぐるしく入れ替わる。\n`;
  text+=`展開ひとつで結果が大きく変わる一戦。`;

 }

 // バランス型
 else{

  text+=`${main}コースが中心だが絶対視までは禁物。\n`;
  text+=`${sub}コースが追走態勢で逆転も視野。\n`;
  text+=`展開次第で波乱含みの流れ。`;

 }

 document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目
// ===============================
function updateBets(ai){

 const sorted=ai.map((v,i)=>({v,i:i+1}))
                .sort((a,b)=>b.v-a.v);

 const a=sorted[0].i;
 const b=sorted[1].i;
 const c=sorted[2].i;
 const d=sorted[3].i;

 const cols=document.querySelectorAll(".bet-col");

 if(cols[0]) setCol(cols[0],[`${a}-${b}-${c}`,`${a}-${c}-${b}`,`${b}-${a}-${c}`]);
 if(cols[1]) setCol(cols[1],[`${b}-${c}-${d}`,`${b}-${d}-${c}`,`${c}-${b}-${d}`]);
 if(cols[2]) setCol(cols[2],[`1-${b}-${c}`,`1-${c}-${b}`,`1-${b}-${d}`]);
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
// 信頼度
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
