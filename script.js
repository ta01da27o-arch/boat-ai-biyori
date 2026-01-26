// ================================
// 画面切替＆24場グリッド
// ================================

const stadiumScreen = document.getElementById('stadiumScreen');
const raceScreen = document.getElementById('raceScreen');
const playerScreen = document.getElementById('playerScreen');

const stadiumGrid = document.querySelector('.stadium-grid');
const raceGrid = document.querySelector('.race-grid');
const raceTitle = document.getElementById('raceTitle');
const backBtn = document.getElementById('backBtn');

const stadiums = [
 '桐生','戸田','江戸川','平和島','多摩川','浜名湖','蒲郡','常滑',
 '津','三国','びわこ','住之江','尼崎','鳴門','丸亀','児島',
 '宮島','徳山','下関','若松','芦屋','福岡','唐津','大村'
];

function createStadiumButtons(){
 stadiumGrid.innerHTML="";
 stadiums.forEach(name=>{
  const d=document.createElement("div");
  d.className="stadium";
  d.textContent=name;
  d.onclick=()=>selectStadium(name);
  stadiumGrid.appendChild(d);
 });
}
createStadiumButtons();

function selectStadium(name){
 raceTitle.textContent=name;
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

// ================================
// コース色（濃色グラフ用）
// ================================

const courseColors={
 1:"#f5f5f5",
 2:"#000000",
 3:"#e53935",
 4:"#1e88e5",
 5:"#fbc02d",
 6:"#43a047"
};

// ================================
// ダミー決まり手
// ================================

function rand(min,max){
 return Math.floor(Math.random()*(max-min+1))+min;
}

function injectDummy(){
 setCourse(1,["逃げ","差され","捲られ","捲差"]);
 setCourse(2,["逃がし","差し","捲り"]);
 for(let i=3;i<=6;i++) setCourse(i,["差し","捲り","捲差"]);
}

function setCourse(c,labels){
 document.querySelectorAll(`.kimarite-course.c${c} .kimarite-row`)
 .forEach(r=>{
  const lab=r.querySelector(".label").textContent.trim();
  if(!labels.includes(lab))return;
  const v=rand(10,80);
  r.querySelector(".value").textContent=v+"%";
  r.querySelector(".bar div").style.width=v+"%";
 });
}

// ================================
// 総合期待度算出
// ================================

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
 });

 detectRaceType();
 buildVisualGraphs();
 generateComment();
}

// ================================
// 共通取得
// ================================

function getVal(c){
 return parseInt(
  document.querySelector(`.expectation-row.c${c} .expectation-value`)
  .textContent
 )||0;
}

// ================================
// 展開タイプAI
// ================================

let currentRaceType="混戦型";

function detectRaceType(){

 const arr=[];
 for(let i=1;i<=6;i++) arr.push({c:i,v:getVal(i)});
 arr.sort((a,b)=>b.v-a.v);

 const top=arr[0], second=arr[1];
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

// ================================
// 攻め指数AI
// ================================

function getAttackPower(c){

 let attack=0;

 document.querySelectorAll(
  `.kimarite-course.c${c} .kimarite-row`
 ).forEach(r=>{

  const lab=r.querySelector(".label").textContent.trim();
  const v=parseInt(r.querySelector(".value").textContent)||0;

  if(lab==="捲り") attack+=v*1.2;
  if(lab==="捲差") attack+=v*1.0;
  if(lab==="差し") attack+=v*0.8;
  if(lab==="逃げ") attack+=v*0.6;

 });

 return attack;
}

// ================================
// 視認性AIグラフ生成（完全新規）
// ================================

function buildVisualGraphs(){

 const attackRaw=[];
 for(let i=1;i<=6;i++) attackRaw.push(getAttackPower(i));
 const attackMax=Math.max(...attackRaw,1);

 for(let i=1;i<=6;i++){

  const row=document.querySelector(`.expectation-row.c${i}`);
  const box=row.querySelector(".expectation-bar");

  // 旧グラフ完全削除
  box.innerHTML="";

  const base=getVal(i);

  let mod=1;

  switch(currentRaceType){
   case "イン逃げ型":
    if(i===1) mod=1.25; else if(i===2) mod=1.05; else mod=0.8;
    break;
   case "差し主導型":
    if(i===2) mod=1.3; else if(i===1) mod=0.85; else mod=1.05;
    break;
   case "まくり一撃型":
    if(i>=3 && i<=5) mod=1.35; else if(i===1) mod=0.75;
    break;
   case "外攻め主導型":
    if(i>=3) mod=1.2; else mod=0.9;
    break;
   case "波乱型":
    mod=rand(80,120)/100;
    break;
   case "混戦型":
    mod=0.9+Math.random()*0.2;
    break;
  }

  let pred=Math.round(base*mod);
  pred=Math.max(0,Math.min(pred,100));

  const ai=Math.round(attackRaw[i-1]/attackMax*100);

  const color=courseColors[i];

  createBar(box,base,color);
  createBar(box,pred,color);
  createBar(box,ai,color);
 }
}

function createBar(parent,val,color){

 const wrap=document.createElement("div");
 wrap.style.border="1px solid #333";
 wrap.style.margin="3px 0";
 wrap.style.height="12px";

 const bar=document.createElement("div");
 bar.style.height="100%";
 bar.style.width=val+"%";
 bar.style.background=color;

 wrap.appendChild(bar);
 parent.appendChild(wrap);
}

// ================================
// 展開コメント
// ================================

function generateComment(){

 let txt="";

 switch(currentRaceType){
  case "イン逃げ型": txt="イン主導の堅い展開。"; break;
  case "差し主導型": txt="差し中心の勝負。"; break;
  case "まくり一撃型": txt="外から一撃狙い。"; break;
  case "外攻め主導型": txt="スピード展開。"; break;
  case "波乱型": txt="高配当注意。"; break;
  case "混戦型": txt="拮抗戦。"; break;
 }

 document.querySelector(".analysis-text").textContent=txt;
}

// ================================
// 初期実行
// ================================

setTimeout(()=>{
 injectDummy();
 calcExpectation();
},300);