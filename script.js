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

 const courseBias=[18,6,2,-3,-8,-12];

 for(let i=0;i<6;i++){

  let b=Math.round(45+Math.random()*30+courseBias[i]);
  let p=Math.round(trend[i]+Math.random()*12-6);

  b=Math.max(1,Math.min(100,b));
  p=Math.max(1,Math.min(100,p));

  let a=Math.round(
   b*0.45+
   p*0.35+
   trend[i]*0.2
  );

  a=Math.max(1,Math.min(100,a));

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
// 総合期待度（完全復活版）
// ===============================
function updateExpectationBars(base,predict,ai){

 const labels=["実績","予測","AI"];
 const colors=["#ff6666","#66a3ff","#33cc66"];

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
   outer.className="bar-outer";

   const bar=document.createElement("div");
   bar.className="bar-inner";
   bar.style.width=val+"%";
   bar.style.background=colors[j];

   outer.appendChild(bar);
   line.appendChild(label);
   line.appendChild(outer);
   box.appendChild(line);
  });

  row.querySelector(".expectation-value").textContent=ai[i]+"%";
 });
}

// ===============================
// 決まり手（NaN防止）
// ===============================
function updateKimarite(base){

 document.querySelectorAll(".kimarite-row").forEach((row,i)=>{

  let v=Math.round(base[i]*0.85+Math.random()*10);
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

 let type="";

 if(inner>middle+10&&inner>outer+15) type="イン逃げ主導型";
 else if(middle>inner&&middle>outer) type="中枠攻め合い型";
 else if(outer>inner&&outer>middle) type="外伸び波乱型";
 else if(Math.max(...ai)-Math.min(...ai)<8) type="超混戦型";
 else type="バランス型";

 document.getElementById("race-type").textContent="展開タイプ : "+type;
}

// ===============================
// 展開解析（記者風リアル）
// ===============================
function updateAnalysis(ai){

 const order=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const main=order[0].i;
 const sub=order[1].i;
 const third=order[2].i;

 let text="";

 if(main===1){
  text=
`スタート踏み込む1コースが先マイ体勢。
握って回る${sub}コースが差しで続き、内有利の決着濃厚。
${third}コースは展開待ちで三着争いまで。
外枠勢は展開向かず厳しい一戦となりそうだ。`;
 }
 else if(main<=3){
  text=
`中枠勢がスタートから積極策。
${main}コースが攻めて主導権を握り、${sub}コースが食い下がる展開。
インは抵抗するもやや分が悪い。
外枠は展開次第で浮上余地あり。`;
 }
 else{
  text=
`外枠から果敢な仕掛け。
${main}コースのまくり一撃が決まる可能性十分。
内は包まれ苦しい隊形。
波乱含みの一戦となりそうだ。`;
 }

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

 const cols=document.querySelectorAll(".bet-col");

 if(cols[0]) setCol(cols[0],[`${a}-${b}-${c}`,`${a}-${c}-${b}`,`${b}-${a}-${c}`]);
 if(cols[1]) setCol(cols[1],[`${b}-${c}-${a}`,`${b}-${a}-${c}`,`${c}-${b}-${a}`]);
 if(cols[2]) setCol(cols[2],[`1-${b}-${c}`,`1-${c}-${b}`,`1-${b}-${a}`]);
}

function setCol(col,arr){
 col.querySelectorAll(".bet-item").forEach((el,i)=>{
  el.textContent=arr[i]||"";
 });
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

 let trust=Math.round(solidity-variance*0.6);
 trust=Math.max(0,Math.min(100,trust));

 let box=document.getElementById("trustMeter");

 if(!box){
  box=document.createElement("div");
  box.id="trustMeter";
  document.getElementById("playerScreen").appendChild(box);
 }

 box.innerHTML=`
 <h2>信頼度メーター</h2>
 <p>堅さ：${solidity}</p>
 <p>荒れ指数：${variance}</p>
 <p><strong>総合信頼度：${trust}%</strong></p>
 `;
  }
