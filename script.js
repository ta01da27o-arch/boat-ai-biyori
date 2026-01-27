/* ============================
   競艇展開予想 完全統合版
============================ */

const stadiums = [
"桐生","戸田","江戸川","平和島","多摩川","浜名湖",
"蒲郡","常滑","津","三国","びわこ","住之江",
"尼崎","鳴門","丸亀","児島","宮島","徳山",
"下関","若松","芦屋","福岡","唐津","大村"
];

const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");

const stadiumScreen=document.getElementById("stadiumScreen");
const raceScreen=document.getElementById("raceScreen");
const playerScreen=document.getElementById("playerScreen");

const backBtn=document.getElementById("backBtn");
const raceTitle=document.getElementById("raceTitle");

const raceTypeBox=document.getElementById("race-type");
const analysisText=document.querySelector(".analysis-text");

/* ============================
   初期表示
============================ */

stadiums.forEach((name,i)=>{
  const div=document.createElement("div");
  div.className="stadium";
  div.textContent=name;
  div.onclick=()=>selectStadium(i);
  stadiumGrid.appendChild(div);
});

function selectStadium(idx){
  stadiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");
  raceGrid.innerHTML="";
  for(let i=1;i<=12;i++){
    const d=document.createElement("div");
    d.className="race";
    d.textContent=`${i}R`;
    d.onclick=()=>selectRace(idx,i);
    raceGrid.appendChild(d);
  }
}

function selectRace(idx,race){
  raceScreen.classList.add("hidden");
  playerScreen.classList.remove("hidden");
  raceTitle.textContent=`${stadiums[idx]} ${race}R`;
  initExpectationBars();
}

backBtn.onclick=()=>{
  playerScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");
};

/* ============================
   総合期待度 3本生成
============================ */

function initExpectationBars(){
  document.querySelectorAll(".expectation-row").forEach(row=>{
    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    const labels=["実績","予測","AI"];

    labels.forEach(l=>{
      const wrap=document.createElement("div");
      wrap.className="bar-line";

      const label=document.createElement("div");
      label.className="bar-label";
      label.textContent=l;

      const bar=document.createElement("div");
      bar.classList.add(
        l==="実績"?"attack-base":
        l==="予測"?"attack-predict":"attack-ai"
      );

      const percent=document.createElement("span");
      percent.className="expectation-value";
      percent.textContent="0%";

      wrap.appendChild(label);
      wrap.appendChild(bar);
      box.appendChild(wrap);
    });
  });
}

/* ============================
   数値取得補助
============================ */

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

/* ============================
   展開タイプ判定
============================ */

function judgeRaceType(values){
  if(values[0]>65) return "イン逃げ主導型";
  if(values[2]>60) return "まくり一撃型";
  if(values[1]>55) return "差し展開型";
  return "混戦型";
}

/* ============================
   AI算出
============================ */

function calcAll(){

  const base=[],predict=[],ai=[];

  for(let i=0;i<6;i++){
    base[i]=rand(30,80);
    predict[i]=rand(20,75);
    ai[i]=Math.round(base[i]*0.4+predict[i]*0.6+rand(-5,5));
  }

  updateBars(base,predict,ai);

  const raceType=judgeRaceType(ai);
  raceTypeBox.textContent=raceType;

  makeAnalysis(raceType,ai);
  makeBets(ai);
}

/* ============================
   バー反映
============================ */

function updateBars(base,predict,ai){

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const lines=row.querySelectorAll(".bar-line");

    const sets=[base[i],predict[i],ai[i]];

    lines.forEach((line,idx)=>{
      const bar=line.querySelector("div");
      const val=line.querySelector("span");

      bar.style.width=sets[idx]+"%";
      val.textContent=sets[idx]+"%";
    });
  });
}

/* ============================
   展開解析
============================ */

function makeAnalysis(type,ai){

  const top=[...ai].map((v,i)=>({v,i}))
                 .sort((a,b)=>b.v-a.v);

  const lead=top[0].i+1;
  const second=top[1].i+1;

  let text="";

  if(type==="イン逃げ主導型"){
    text=`スタートから1コースが主導権を握る展開。${lead}コース中心で隊形が固まり、${second}コースが追走する流れ。`;
  }
  else if(type==="まくり一撃型"){
    text=`3〜4コース勢が一気に攻勢。${lead}コースのまくりが決まり、内側は対応に追われる展開。`;
  }
  else if(type==="差し展開型"){
    text=`内外の攻防から差し場が生まれ、${lead}コースが冷静に抜け出す展開。`;
  }
  else{
    text=`スタートから混戦模様。各艇が攻め合い、展開次第で着順が大きく変わるレース。`;
  }

  analysisText.textContent=text;
}

/* ============================
   買い目生成（3枠）
============================ */

function makeBets(ai){

  const order=[...ai].map((v,i)=>({v,i}))
                     .sort((a,b)=>b.v-a.v)
                     .map(o=>o.i+1);

  const main=[
    `${order[0]}-${order[1]}-${order[2]}`,
    `${order[0]}-${order[2]}-${order[1]}`,
    `${order[1]}-${order[0]}-${order[2]}`
  ];

  const sub=[
    `${order[1]}-${order[2]}-${order[0]}`,
    `${order[1]}-${order[0]}-${order[2]}`,
    `${order[2]}-${order[1]}-${order[0]}`
  ];

  const escape=[
    `1-${order[1]}-${order[2]}`,
    `1-${order[2]}-${order[1]}`,
    `1-${order[0]}-${order[1]}`
  ];

  const cols=document.querySelectorAll(".bet-col");

  [main,sub,escape].forEach((arr,idx)=>{
    const items=cols[idx].querySelectorAll(".bet-item");
    items.forEach((el,i)=>{
      el.textContent=arr[i]||"";
    });
  });
}

/* ============================
   入力監視 → 再計算
============================ */

document.querySelectorAll(".player-input").forEach(inp=>{
  inp.addEventListener("input",calcAll);
});

/* 初期化 */

initExpectationBars();
calcAll();