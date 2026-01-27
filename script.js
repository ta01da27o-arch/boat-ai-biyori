/**************************************************
 競艇展開予想 完全統合フル script.js
**************************************************/

document.addEventListener("DOMContentLoaded",()=>{

/* =============================
 24場 正式名
============================= */

const stadiums=[
"桐生","戸田","江戸川","平和島",
"多摩川","浜名湖","蒲郡","常滑",
"津","三国","びわこ","住之江",
"尼崎","鳴門","丸亀","児島",
"宮島","徳山","下関","若松",
"芦屋","福岡","唐津","大村"
];

/* =============================
 DOM
============================= */

const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");

const stadiumScreen=document.getElementById("stadiumScreen");
const raceScreen=document.getElementById("raceScreen");
const playerScreen=document.getElementById("playerScreen");

const backBtn=document.getElementById("backBtn");
const raceTitle=document.getElementById("raceTitle");

const raceTypeBox=document.getElementById("race-type");
const analysisText=document.querySelector(".analysis-text");

/* =============================
 ① 場選択
============================= */

stadiums.forEach(name=>{
  const btn=document.createElement("div");
  btn.className="stadium";
  btn.textContent=name;
  btn.onclick=()=>{
    stadiumScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");
    raceTitle.textContent=name+" レース選択";
    createRaceButtons();
  };
  stadiumGrid.appendChild(btn);
});

/* =============================
 レース生成
============================= */

function createRaceButtons(){
  raceGrid.innerHTML="";
  for(let i=1;i<=12;i++){
    const r=document.createElement("div");
    r.className="race";
    r.textContent=i+"R";
    r.onclick=()=>{
      raceScreen.classList.add("hidden");
      playerScreen.classList.remove("hidden");
      runAllAI();
    };
    raceGrid.appendChild(r);
  }
}

backBtn.onclick=()=>{
  raceScreen.classList.add("hidden");
  stadiumScreen.classList.remove("hidden");
};

/* =============================
 メインAI実行
============================= */

function runAllAI(){
  generateRandomData();
  const scores=calcTotalScores();
  updateExpectationGraph(scores);
  const type=detectRaceType(scores);
  showRaceType(type);
  generateAnalysis(type,scores);
  generateBets(type,scores);
}

/* =============================
 ダミーデータ生成
============================= */

function generateRandomData(){
  document.querySelectorAll(".bar div").forEach(bar=>{
    const v=Math.floor(Math.random()*80)+10;
    bar.style.width=v+"%";
    bar.parentElement.nextElementSibling.textContent=v+"%";
  });
}

/* =============================
 総合期待度算出
============================= */

function calcTotalScores(){
  let scores=[];
  for(let i=1;i<=6;i++){
    const base=Math.floor(Math.random()*70)+10;
    const predict=Math.floor(Math.random()*70)+10;
    const ai=Math.floor(Math.random()*70)+10;
    scores.push({course:i,base,predict,ai,total:base+predict+ai});
  }
  return scores.sort((a,b)=>b.total-a.total);
}

/* =============================
 期待度3本グラフ描画
============================= */

function updateExpectationGraph(scores){

  scores.forEach((s,rank)=>{

    const row=document.querySelector(`.expectation-row.c${s.course}`);
    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    createBar(box,"実績",s.base);
    createBar(box,"予測",s.predict);
    createBar(box,"AI",s.ai);

    row.querySelector(".expectation-value").textContent=
      Math.round(s.total/3)+"%";
  });
}

function createBar(parent,label,val){

  const wrap=document.createElement("div");
  wrap.className="bar-line";

  const lab=document.createElement("div");
  lab.className="bar-label";
  lab.textContent=label;

  const bar=document.createElement("div");
  bar.style.width=val+"%";

  const num=document.createElement("div");
  num.style.width="34px";
  num.style.textAlign="right";
  num.style.fontSize="12px";
  num.textContent=val;

  wrap.appendChild(lab);
  wrap.appendChild(bar);
  wrap.appendChild(num);

  parent.appendChild(wrap);
}

/* =============================
 展開タイプ判定AI（①）
============================= */

function detectRaceType(scores){

  const top=scores[0].course;

  if(top===1) return "イン逃げ主導型";

  if(scores[0].course>=3 && scores[0].course<=4)
    return "まくり勝負型";

  if(scores[0].course===2)
    return "差し展開型";

  return "混戦波乱型";
}

/* =============================
 展開タイプ表示
============================= */

function showRaceType(type){
  raceTypeBox.textContent="展開タイプ："+type;
}

/* =============================
 展開解析生成
============================= */

function generateAnalysis(type,scores){

  let txt="";

  switch(type){

    case "イン逃げ主導型":
      txt="1コースがスタート主導権を握り逃げ切り濃厚展開。内有利で波乱要素は少ない。";
      break;

    case "まくり勝負型":
      txt="中枠勢がスピード勝負を仕掛ける展開。スタート次第で一気の逆転あり。";
      break;

    case "差し展開型":
      txt="2コース中心に内外の差し比べ。展開読みが重要な一戦。";
      break;

    case "混戦波乱型":
      txt="各艇拮抗し展開次第で着順変動大。高配当期待レース。";
      break;
  }

  analysisText.textContent=txt;
}

/* =============================
 買い目生成（3枠）
============================= */

function generateBets(type,scores){

  const first=scores[0].course;
  const second=scores[1].course;
  const third=scores[2].course;

  const honmei=[
    `${first}-${second}-${third}`,
    `${first}-${third}-${second}`,
    `${second}-${first}-${third}`
  ];

  const taikou=[
    `${second}-${third}-${first}`,
    `${second}-${first}-${third}`,
    `${third}-${second}-${first}`
  ];

  const nige=[
    `1-${second}-${third}`,
    `1-${third}-${second}`,
    `1-${third}-${scores[3].course}`
  ];

  fillBet("honmei",honmei);
  fillBet("taikou",taikou);
  fillBet("nige",nige);
}

function fillBet(cls,list){
  const box=document.querySelector(`.${cls}`);
  box.innerHTML="";
  list.forEach(b=>{
    const d=document.createElement("div");
    d.className="bet-row";
    d.textContent=b;
    box.appendChild(d);
  });
}

});