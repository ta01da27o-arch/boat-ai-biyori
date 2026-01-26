// ============================================
// 画面切替＆24場グリッド
// ============================================

const stadiumScreen=document.getElementById("stadiumScreen");
const raceScreen=document.getElementById("raceScreen");
const playerScreen=document.getElementById("playerScreen");

const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");
const raceTitle=document.getElementById("raceTitle");
const backBtn=document.getElementById("backBtn");

const stadiums=[
"桐生","戸田","江戸川","平和島","多摩川","浜名湖","蒲郡","常滑",
"津","三国","びわこ","住之江","尼崎","鳴門","丸亀","児島",
"宮島","徳山","下関","若松","芦屋","福岡","唐津","大村"
];

function createStadiumButtons(){
 stadiumGrid.innerHTML="";
 stadiums.forEach(n=>{
  const d=document.createElement("div");
  d.className="stadium";
  d.textContent=n;
  d.onclick=()=>selectStadium(n);
  stadiumGrid.appendChild(d);
 });
}
createStadiumButtons();

function selectStadium(n){
 raceTitle.textContent=n;
 stadiumScreen.classList.add("hidden");
 raceScreen.classList.remove("hidden");
 createRaceButtons();
}

function createRaceButtons(){
 raceGrid.innerHTML="";
 for(let i=1;i<=12;i++){
  const d=document.createElement("div");
  d.className="race";
  d.textContent=i+"R";
  d.onclick=()=>playerScreen.classList.remove("hidden");
  raceGrid.appendChild(d);
 }
}

backBtn.onclick=()=>{
 raceScreen.classList.add("hidden");
 stadiumScreen.classList.remove("hidden");
 playerScreen.classList.add("hidden");
};

// ============================================
// 色定義（各コース固定）
// ============================================

const courseColors={
1:"#ffffff",
2:"#000000",
3:"#ff3333",
4:"#3366ff",
5:"#ffd800",
6:"#33cc66"
};

// ============================================
// ダミー決まり手データ
// ============================================

function rand(min,max){
 return Math.floor(Math.random()*(max-min+1))+min;
}

function injectDummy(){
 setCourse(1,["逃げ","差され","捲られ","捲差"]);
 setCourse(2,["逃がし","差し","捲り"]);
 for(let i=3;i<=6;i++){
  setCourse(i,["差し","捲り","捲差"]);
 }
}

function setCourse(c,labels){
 document.querySelectorAll(`.kimarite-course.c${c} .kimarite-row`)
 .forEach(r=>{
  const lab=r.querySelector(".label").textContent.trim();
  if(!labels.includes(lab)) return;
  const v=rand(10,80);
  r.querySelector(".value").textContent=v+"%";
  r.querySelector(".bar div").style.width=v+"%";
 });
}

// ============================================
// 共通取得
// ============================================

function getVal(c){
 const row=document.querySelector(`.expectation-row.c${c}`);
 if(!row) return 0;
 return parseInt(row.querySelector(".expectation-value").textContent)||0;
}

// ============================================
// 攻め指数AI算出
// ============================================

function getAttackPower(c){

 const rows=document.querySelectorAll(
  `.kimarite-course.c${c} .kimarite-row`
 );

 let attack=0;

 rows.forEach(r=>{
  const lab=r.querySelector(".label").textContent.trim();
  const v=parseInt(r.querySelector(".value").textContent)||0;

  if(lab==="捲り") attack+=v*1.2;
  if(lab==="捲差") attack+=v*1.0;
  if(lab==="差し") attack+=v*0.8;
  if(lab==="逃げ") attack+=v*0.6;
 });

 return attack;
}

// ============================================
// 展開補正AI
// ============================================

function applyRaceFlow(c,base){

 const inner=getVal(1);
 let mod=1;

 if(inner>=70 && c>=3) mod-=0.25;
 if(inner<=40 && c>=3) mod+=0.25;
 if(c===3||c===4) mod+=0.15;
 if(c===6) mod-=0.15;

 let v=Math.round(base*mod);
 return Math.max(Math.min(v,100),0);
}

// ============================================
// 攻め指数バー生成（縦並び）
// ============================================

function buildAttackBars(){

 for(let i=1;i<=6;i++){

  const row=document.querySelector(`.expectation-row.c${i}`);
  if(!row) continue;

  const box=row.querySelector(".expectation-bar");

  if(!box.querySelector(".attack-base")){

   box.innerHTML=`
    <div class="attack-base"></div>
    <div class="attack-predict"></div>
    <div class="attack-ai"></div>
   `;
  }

  const bars=box.querySelectorAll("div");

  bars.forEach(b=>{
   b.style.background=courseColors[i];
   b.style.height="8px";
   b.style.margin="2px 0";
  });
 }
}

// ============================================
// 攻め指数更新
// ============================================

function updateAttackGraphs(){

 let raw=[];

 for(let i=1;i<=6;i++){
  raw.push(getAttackPower(i));
 }

 const max=Math.max(...raw,1);

 for(let i=1;i<=6;i++){

  const row=document.querySelector(`.expectation-row.c${i}`);
  if(!row) continue;

  const baseBar=row.querySelector(".attack-base");
  const predBar=row.querySelector(".attack-predict");
  const aiBar=row.querySelector(".attack-ai");

  const base=Math.round(raw[i-1]/max*100);

  const predicted=Math.round(base*(
   i===1?1.15:
   i===2?1.05:
   i===5?0.9:
   i===6?0.85:1
  ));

  const aiVal=applyRaceFlow(i,base);

  baseBar.style.width=base+"%";
  predBar.style.width=Math.min(predicted,100)+"%";
  aiBar.style.width=aiVal+"%";
 }
}

// ============================================
// 総合期待度算出
// ============================================

function calcExpectation(){

 const totals=[];

 for(let i=1;i<=6;i++){
  let t=0;
  document.querySelectorAll(`.kimarite-course.c${i} .kimarite-row`)
  .forEach(r=>{
   t+=parseInt(r.querySelector(".value").textContent)||0;
  });
  totals.push(t);
 }

 const max=Math.max(...totals,1);

 totals.forEach((v,i)=>{
  const p=Math.round(v/max*100);
  const row=document.querySelector(`.expectation-row.c${i+1}`);

  row.querySelector(".expectation-value").textContent=p+"%";

  let main=row.querySelector(".main-bar");
  if(!main){
   main=document.createElement("div");
   main.className="main-bar";
   row.querySelector(".expectation-bar").prepend(main);
  }

  main.style.width=p+"%";
  main.style.background=courseColors[i+1];
  main.style.height="8px";
  main.style.margin="2px 0";
 });

 detectRaceType();
 updatePrediction();
 generateComment();
 generateBets(totals);
 updateAttackGraphs();
}

// ============================================
// 展開タイプAI
// ============================================

let currentRaceType="混戦型";

function detectRaceType(){

 const arr=[];
 for(let i=1;i<=6;i++){
  arr.push({c:i,v:getVal(i)});
 }

 arr.sort((a,b)=>b.v-a.v);

 const top=arr[0],second=arr[1];
 const one=arr.find(x=>x.c===1).v;

 if(top.c===1 && top.v>=70 && top.v-second.v>=15)
  currentRaceType="イン逃げ型";

 else if(top.c===2 && top.v>=60)
  currentRaceType="差し主導型";

 else if(top.c>=3 && top.v>=65)
  currentRaceType="まくり一撃型";

 else if(one<=30 && top.c!==1)
  currentRaceType="波乱型";

 else if(top.v-second.v<=10)
  currentRaceType="混戦型";

 else
  currentRaceType="外攻め主導型";

 document.getElementById("race-type").textContent=
  "展開タイプ："+currentRaceType;
}

// ============================================
// 予測バーAI
// ============================================

function updatePrediction(){

 for(let i=1;i<=6;i++){

  const base=getVal(i);
  let mod=1;

  switch(currentRaceType){

   case "イン逃げ型":
    if(i===1) mod=1.25;
    else if(i===2) mod=1.05;
    else mod=0.8;
    break;

   case "差し主導型":
    if(i===2) mod=1.3;
    else if(i===1) mod=0.85;
    else mod=1.05;
    break;

   case "まくり一撃型":
    if(i>=3&&i<=5) mod=1.35;
    else if(i===1) mod=0.75;
    else mod=1;
    break;

   case "外攻め主導型":
    if(i>=3) mod=1.2;
    else mod=0.9;
    break;

   case "波乱型":
    mod=rand(80,120)/100;
    break;

   case "混戦型":
    mod=0.9+Math.random()*0.2;
    break;
  }

  let pred=Math.round(base*mod);
  pred=Math.max(Math.min(pred,100),0);

  const row=document.querySelector(`.expectation-row.c${i}`);

  let pbar=row.querySelector(".prediction-bar");
  if(!pbar){
   pbar=document.createElement("div");
   pbar.className="prediction-bar";
   row.querySelector(".expectation-bar").appendChild(pbar);
  }

  pbar.style.width=pred+"%";
  pbar.style.background=courseColors[i];
  pbar.style.height="8px";
  pbar.style.margin="2px 0";
 }
}

// ============================================
// 展開コメントAI
// ============================================

function generateComment(){

 let t="";

 switch(currentRaceType){
  case "イン逃げ型": t="イン主導の堅い展開。逃げ中心。"; break;
  case "差し主導型": t="差し有力。イン残り注意。"; break;
  case "まくり一撃型": t="外から一撃まくり濃厚。"; break;
  case "外攻め主導型": t="攻め艇優勢。展開速い。"; break;
  case "波乱型": t="波乱含み。高配当注意。"; break;
  case "混戦型": t="拮抗戦。展開次第。"; break;
 }

 document.querySelector(".analysis-text").textContent=t;
}

// ============================================
// 買い目算出
// ============================================

function generateBets(tot){

 const arr=tot.map((v,i)=>({c:i+1,v}));
 arr.sort((a,b)=>b.v-a.v);

 const a=arr[0].c,b=arr[1].c,c=arr[2].c;

 const rows=document.querySelectorAll(".bet-row");

 if(rows[0]) rows[0].querySelector(".bet-content").textContent=`${a}-${b}-${c}`;
 if(rows[1]) rows[1].querySelector(".bet-content").textContent=`${a}-${c}-${b}`;
 if(rows[2]) rows[2].querySelector(".bet-content").textContent=`${b}-${a}-${c}`;
}

// ============================================
// 監視連動
// ============================================

function observeAll(){

 const obs=new MutationObserver(()=>{
  calcExpectation();
 });

 document.querySelectorAll(".value").forEach(el=>{
  obs.observe(el,{
   childList:true,
   characterData:true,
   subtree:true
  });
 });
}

// ============================================
// 初期実行
// ============================================

setTimeout(()=>{
 injectDummy();
 buildAttackBars();
 calcExpectation();
 observeAll();
},300);