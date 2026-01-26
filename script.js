// ================================
// 画面切替
// ================================

const stadiumScreen = document.getElementById("stadiumScreen");
const raceScreen = document.getElementById("raceScreen");
const playerScreen = document.getElementById("playerScreen");

const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

const raceTitle = document.getElementById("raceTitle");
const backBtn = document.getElementById("backBtn");

const stadiums = [
  "桐生","戸田","江戸川","平和島",
  "多摩川","浜名湖","蒲郡","常滑",
  "津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島",
  "宮島","徳山","下関","若松",
  "芦屋","福岡","唐津","大村"
];

createStadiumButtons();

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
// ダミー決まり手生成
// ================================

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
  .forEach(row=>{

    const label=row.querySelector(".label").textContent.trim();
    if(!labels.includes(label))return;

    const v=rand(10,80);

    row.querySelector(".bar div").style.width=v+"%";
    row.querySelector(".value").textContent=v+"%";
  });
}

// ================================
// 総合期待度算出
// ================================

function calcBaseExpectation(course){

  let total=0;

  document.querySelectorAll(`.kimarite-course.c${course} .kimarite-row`)
  .forEach(row=>{
    total+=parseInt(row.querySelector(".value").textContent)||0;
  });

  return total;
}

function updateBaseExpectations(){

  const bases=[];

  for(let i=1;i<=6;i++){
    bases.push(calcBaseExpectation(i));
  }

  const max=Math.max(...bases,1);

  bases.forEach((v,i)=>{

    const percent=Math.round(v/max*100);

    const row=document.querySelector(`.expectation-row.c${i+1}`);

    row.querySelector(".expectation-bar div").style.width=percent+"%";
    row.querySelector(".expectation-value").textContent=percent+"%";
  });

  updatePredictionBars();
  detectRaceType();
  generateBets(bases);
  generateComment(bases);
}

// ================================
// 二重グラフ（予測）
// ================================

function predict(course){

  const base=parseInt(
    document.querySelector(`.expectation-row.c${course} .expectation-value`)
    .textContent
  )||0;

  let mod=1;

  if(course===1){

    const outside=
      getVal(3)+getVal(4)+getVal(5)+getVal(6);

    if(outside>250) mod-=0.25;
    else if(outside>180) mod-=0.15;
    else mod+=0.15;

  }else{

    const inner=getVal(1);

    if(inner>70) mod-=0.2;
    else if(inner<40) mod+=0.2;
    else mod+=0.05;
  }

  let p=Math.round(base*mod);
  return Math.max(0,Math.min(100,p));
}

function getVal(c){
  return parseInt(
    document.querySelector(`.expectation-row.c${c} .expectation-value`)
    .textContent
  )||0;
}

function updatePredictionBars(){

  for(let i=1;i<=6;i++){

    const row=document.querySelector(`.expectation-row.c${i}`);

    let bar=row.querySelector(".prediction-bar");

    if(!bar){
      bar=document.createElement("div");
      bar.className="prediction-bar";
      row.querySelector(".expectation-bar").appendChild(bar);
    }

    bar.style.width=predict(i)+"%";
  }
}

// ================================
// 展開タイプ判定
// ================================

function detectRaceType(){

  const arr=[];

  for(let i=1;i<=6;i++){
    arr.push({course:i,value:getVal(i)});
  }

  arr.sort((a,b)=>b.value-a.value);

  const top=arr[0];
  const second=arr[1];

  let type="混戦";

  if(top.course===1 && top.value>=70 && top.value-second.value>=15)
    type="イン逃げ濃厚";

  else if(arr.find(s=>s.course===1).value<=30 && top.course!==1)
    type="波乱注意";

  else if(top.course>=3)
    type="外攻め主導";

  document.getElementById("race-type").textContent=
    "展開タイプ："+type;
}

// ================================
// 展開コメント
// ================================

function generateComment(scores){

  const r=scores
    .map((v,i)=>({c:i+1,v}))
    .sort((a,b)=>b.v-a.v);

  const t=r[0], s=r[1];

  let txt="";

  if(t.v-s.v>=30){
    txt=t.c===1
      ?"イン圧倒的優勢。逃げ濃厚。"
      :`${t.c}コース主導の攻め展開。`;
  }
  else if(t.v>=60){
    txt=t.c===1
      ?"イン有利だが逆転注意。"
      :"攻めとイン拮抗。";
  }
  else{
    txt="混戦模様で高配当注意。";
  }

  document.querySelector(".analysis-text").textContent=txt;
}

// ================================
// 買い目算出
// ================================

function generateBets(scores){

  const r=scores
    .map((v,i)=>({c:i+1,v}))
    .sort((a,b)=>b.v-a.v);

  const a=r[0].c,b=r[1].c,c=r[2].c;

  const rows=document.querySelectorAll(".bet-row");

  if(rows[0]) rows[0].querySelector(".bet-content").textContent=`${a}-${b}-${c}`;
  if(rows[1]) rows[1].querySelector(".bet-content").textContent=`${a}-${c}-${b}`;
  if(rows[2]) rows[2].querySelector(".bet-content").textContent=`${b}-${a}-${c}`;
}

// ================================
// 初期実行
// ================================

setTimeout(()=>{
  injectDummy();
  updateBaseExpectations();
},300);