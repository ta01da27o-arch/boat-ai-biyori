// ===============================
// 24場名
// ===============================
const stadiums = [
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
const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

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
function selectStadium(i){
  stadiumScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");
  raceTitle.textContent=stadiums[i];
}

function selectRace(){
  raceScreen.classList.add("hidden");
  playerScreen.classList.remove("hidden");
  calcAll();
}

// ===============================
// メイン計算
// ===============================
function calcAll(){

  let base=[],predict=[],ai=[];

  for(let i=0;i<6;i++){
    const b=Math.floor(40+Math.random()*40);
    const p=Math.floor(35+Math.random()*45);
    const a=Math.round(b*0.4+p*0.6);

    base.push(b);
    predict.push(p);
    ai.push(a);
  }

  updateExpectationBars(base,predict,ai);
  updateKimarite();
  updateRaceTypeByAI(ai);
  updateAnalysis(ai);
  updateBets(ai);
  updateHitRateSimulation(base,predict,ai);
}

// ===============================
// 総合期待度
// ===============================
function updateExpectationBars(base,predict,ai){

  const colors=["#fff","#000","#f33","#36f","#fc0","#3c6"];
  const labels=["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    [base[i],predict[i],ai[i]].forEach((v,j)=>{

      const line=document.createElement("div");
      line.style.display="flex";
      line.style.alignItems="center";
      line.style.marginBottom="3px";

      const lab=document.createElement("span");
      lab.textContent=labels[j];
      lab.style.width="40px";

      const out=document.createElement("div");
      out.style.flex="1";
      out.style.height="14px";
      out.style.border="1px solid #333";
      out.style.background=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"][i];
      out.style.position="relative";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=v+"%";
      bar.style.background=colors[i];
      bar.style.border="1px solid #000";

      const txt=document.createElement("span");
      txt.textContent=v+"%";
      txt.style.position="absolute";
      txt.style.right="4px";
      txt.style.fontSize="11px";

      out.appendChild(bar);
      out.appendChild(txt);

      line.appendChild(lab);
      line.appendChild(out);
      box.appendChild(line);
    });

    row.querySelector(".expectation-value").textContent=ai[i]+"%";
  });
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

  let type="バランス型";

  if(inner>middle+10&&inner>outer+15) type="イン逃げ主導型";
  else if(middle>inner&&middle>outer) type="中枠攻め合い型";
  else if(outer>inner&&outer>middle) type="外伸び波乱型";

  raceType.textContent="展開タイプ : "+type;
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

  const order=ai.map((v,i)=>({v,i:i+1}))
                .sort((a,b)=>b.v-a.v);

  let txt="";
  if(order[0].i===1) txt="イン有利な展開。";
  else if(order[0].i<=3) txt="中枠主導。";
  else txt="外枠波乱傾向。";

  txt+=`\n軸:${order[0].i} 対抗:${order[1].i}`;

  document.querySelector(".analysis-text").textContent=txt;
}

// ===============================
// 買い目（完成済そのまま）
// ===============================
function updateBets(ai){

  const sorted=ai.map((v,i)=>({v,i:i+1}))
                 .sort((a,b)=>b.v-a.v);

  const main=sorted[0].i;
  const sub=sorted[1].i;
  const third=sorted[2].i;

  const others=[1,2,3,4,5,6].filter(n=>n!==1);

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

  setCol(cols[2],[
    `1-${others[0]}-${others[1]}`,
    `1-${others[1]}-${others[0]}`,
    `1-${others[2]}-${others[3]}`
  ]);
}

function setCol(col,arr){
  col.querySelectorAll(".bet-item").forEach((e,i)=>{
    e.textContent=arr[i]||"";
  });
}

// ===============================
// 的中率シミュレーション（完全復活版）
// ===============================
function updateHitRateSimulation(base,predict,ai){

  const rows=document.querySelectorAll("#hitRateSection .hitrate-row");

  const colors=["#fff","#000","#f33","#36f","#fc0","#3c6"];

  rows.forEach((row,i)=>{

    const rate=Math.round((base[i]+predict[i]+ai[i])/3);

    const value=row.querySelector(".hitrate-value");
    const barWrap=row.querySelector(".hitrate-bar");
    const bar=row.querySelector(".hitrate-bar div");

    // 見えるよう強制設定
    barWrap.style.flex="1";
    barWrap.style.height="14px";
    barWrap.style.border="1px solid #333";
    barWrap.style.position="relative";
    barWrap.style.background=["#fff","#eee","#ffe5e5","#e5f0ff","#fff7cc","#e5ffe5"][i];

    bar.style.height="100%";
    bar.style.width=rate+"%";
    bar.style.background=colors[i];

    value.textContent=rate+"%";
  });
}