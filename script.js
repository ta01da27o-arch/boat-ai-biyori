// =====================================
// 画面切替＆24場グリッド
// =====================================

const stadiumScreen=document.getElementById("stadiumScreen");
const raceScreen=document.getElementById("raceScreen");
const playerScreen=document.getElementById("playerScreen");

const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");
const raceTitle=document.getElementById("raceTitle");
const backBtn=document.getElementById("backBtn");

const stadiums=[
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

// =====================================
// ダミーデータ
// =====================================

function rand(min,max){
 return Math.floor(Math.random()*(max-min+1))+min;
}

function injectDummy(){

 for(let c=1;c<=6;c++){
  document.querySelectorAll(`.kimarite-course.c${c} .kimarite-row`)
  .forEach(r=>{
    const v=rand(10,80);
    r.querySelector(".value").textContent=v+"%";
    r.querySelector(".bar div").style.width=v+"%";
  });
 }
}

// =====================================
// 共通取得
// =====================================

function getVal(c){
 const el=document.querySelector(`.expectation-row.c${c} .expectation-value`);
 return el?parseInt(el.textContent)||0:0;
}

// =====================================
// 総合期待度算出
// =====================================

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
 generateBets(totals);
}

// =====================================
// 展開タイプAI
// =====================================

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

// =====================================
// コース原色
// =====================================

const courseColors={
 1:"#ffffff",
 2:"#000000",
 3:"#e53935",
 4:"#1e88e5",
 5:"#fbc02d",
 6:"#43a047"
};

// =====================================
// 攻め指数AI
// =====================================

function getAttackPower(c){

 let atk=0;

 document.querySelectorAll(`.kimarite-course.c${c} .kimarite-row`)
 .forEach(r=>{
  const lab=r.querySelector(".label").textContent.trim();
  const v=parseInt(r.querySelector(".value").textContent)||0;

  if(lab==="捲り") atk+=v*1.2;
  if(lab==="捲差") atk+=v*1.0;
  if(lab==="差し") atk+=v*0.8;
  if(lab==="逃げ") atk+=v*0.6;
 });

 return atk;
}

// =====================================
// 視認性AIグラフ生成
// =====================================

function buildVisualGraphs(){

 for(let i=1;i<=6;i++){

  const row=document.querySelector(`.expectation-row.c${i}`);
  if(!row) continue;

  const box=row.querySelector(".expectation-bar");

  // ★旧黒背景完全削除
  box.innerHTML="";
  box.style.background="transparent";

  const base=getVal(i);

  let mod=1;

  switch(currentRaceType){
   case "イン逃げ型":
    mod=i===1?1.25:0.8; break;
   case "差し主導型":
    mod=i===2?1.3:1.05; break;
   case "まくり一撃型":
    mod=(i>=3&&i<=5)?1.35:0.75; break;
   case "外攻め主導型":
    mod=i>=3?1.2:0.9; break;
   case "波乱型":
    mod=rand(80,120)/100; break;
   case "混戦型":
    mod=0.9+Math.random()*0.2; break;
  }

  const predicted=Math.min(Math.round(base*mod),100);

  const rawAtk=getAttackPower(i);
  const aiVal=Math.min(Math.round(rawAtk/200*100),100);

  createBar(box,base,courseColors[i]);
  createBar(box,predicted,courseColors[i]);
  createBar(box,aiVal,courseColors[i]);
 }
}

// =====================================
// バー生成
// =====================================

function createBar(parent,val,color){

 const wrap=document.createElement("div");
 wrap.style.height="10px";
 wrap.style.margin="4px 0";
 wrap.style.border="1px solid #666";
 wrap.style.borderRadius="4px";
 wrap.style.background="transparent";
 wrap.style.overflow="hidden";

 const bar=document.createElement("div");
 bar.style.width=val+"%";
 bar.style.height="100%";
 bar.style.background=color;

 wrap.appendChild(bar);
 parent.appendChild(wrap);
}

// =====================================
// 展開コメント
// =====================================

function generateComment(){

 let t="";

 switch(currentRaceType){
  case "イン逃げ型": t="イン主導の堅い展開。"; break;
  case "差し主導型": t="差し中心の攻防。"; break;
  case "まくり一撃型": t="外から一撃狙い。"; break;
  case "外攻め主導型": t="攻め艇優勢。"; break;
  case "波乱型": t="波乱含み。"; break;
  case "混戦型": t="拮抗戦。"; break;
 }

 document.querySelector(".analysis-text").textContent=t;
}

// =====================================
// 買い目算出
// =====================================

function generateBets(tot){

 const arr=tot.map((v,i)=>({c:i+1,v}));
 arr.sort((a,b)=>b.v-a.v);

 const a=arr[0].c,b=arr[1].c,c=arr[2].c;

 const rows=document.querySelectorAll(".bet-row");

 if(rows[0]) rows[0].querySelector(".bet-content").textContent=`${a}-${b}-${c}`;
 if(rows[1]) rows[1].querySelector(".bet-content").textContent=`${a}-${c}-${b}`;
 if(rows[2]) rows[2].querySelector(".bet-content").textContent=`${b}-${a}-${c}`;
}

// =====================================
// 初期実行
// =====================================

setTimeout(()=>{
 injectDummy();
 calcExpectation();
},300);