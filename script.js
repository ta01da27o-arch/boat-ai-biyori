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
// コース色固定
// ===============================
const courseColors = ["#ffffff","#000000","#ff0000","#0000ff","#ffff00","#00ff00"];

// ===============================
// 初期表示
// ===============================
const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

stadiums.forEach((name,i)=>{
  const div = document.createElement("div");
  div.className = "stadium";
  div.textContent = name;
  div.onclick = () => selectStadium(i);
  stadiumGrid.appendChild(div);
});

for(let i=1;i<=12;i++){
  const div = document.createElement("div");
  div.className = "race";
  div.textContent = i + "R";
  div.onclick = () => selectRace(i);
  raceGrid.appendChild(div);
}

document.getElementById("backBtn").onclick = () => {
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("stadiumScreen").classList.remove("hidden");
};

// ===============================
// 画面遷移
// ===============================
let currentStadiumIndex = 0;

function selectStadium(i){
  currentStadiumIndex = i;
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent = stadiums[i];
}

function selectRace(){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");
  calcAllWithTrend(currentStadiumIndex);
}

// ===============================
// 過去傾向データ
// ===============================
const pastTrend = [
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

  let base=[], predict=[], ai=[];
  const trend = pastTrend[stadiumIndex];

  for(let i=0;i<6;i++){

    const courseBias=[18,6,2,-3,-8,-12][i];

    let b=Math.round(45+Math.random()*30+courseBias);
    let p=Math.round(trend[i]+Math.random()*12-6);

    b=Math.max(1,Math.min(100,b));
    p=Math.max(1,Math.min(100,p));

    let a=Math.round(b*0.45+p*0.35+trend[i]*0.2);
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
  updateHitRateSimulation(base,predict,ai); // ← 今回ここだけ正常化
  updateTrustMeter(ai);
}

// ===============================
// 的中率シュミレーション（修正版）
// ===============================
function updateHitRateSimulation(base,predict,ai){

  const rows=document.querySelectorAll(".hitrate-row");

  rows.forEach((row,i)=>{

    const rate=Math.round((base[i]+predict[i]+ai[i])/3);

    // 表示 → 「コース番号 + 空白 + %」
    row.querySelector(".hitrate-value").textContent=(i+1)+" "+rate+"%";

    const barBox=row.querySelector(".hitrate-bar");

    // 既存バーを消して再生成（各コース分）
    barBox.innerHTML="";

    const outer=document.createElement("div");
    outer.style.width="100%";
    outer.style.height="14px";
    outer.style.border="1px solid #333";
    outer.style.borderRadius="4px";
    outer.style.background="#ddd";

    const bar=document.createElement("div");
    bar.style.height="100%";
    bar.style.width=rate+"%";
    bar.style.background=courseColors[i];

    outer.appendChild(bar);
    barBox.appendChild(outer);
  });
}

// ===============================
// 以下 既存コード完全そのまま
// ===============================

function updateExpectationBars(base,predict,ai){

  const labels=["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const barBox=row.querySelector(".expectation-bar");
    barBox.innerHTML="";

    [base[i],predict[i],ai[i]].forEach((val,j)=>{

      const wrap=document.createElement("div");
      wrap.style.display="flex";
      wrap.style.alignItems="center";
      wrap.style.marginBottom="2px";

      const label=document.createElement("span");
      label.textContent=labels[j];
      label.style.width="40px";
      label.style.fontSize="12px";
      wrap.appendChild(label);

      const outer=document.createElement("div");
      outer.style.flex="1";
      outer.style.height="14px";
      outer.style.border="1px solid #333";
      outer.style.borderRadius="4px";
      outer.style.background="#ddd";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=val+"%";
      bar.style.background=courseColors[i];

      outer.appendChild(bar);
      wrap.appendChild(outer);
      barBox.appendChild(wrap);
    });

    row.querySelector(".expectation-value").textContent=ai[i]+"%";
  });
}

function updateKimarite(base){

  document.querySelectorAll(".kimarite-row").forEach((row,i)=>{

    let v=Math.round((base[i]||1)*0.85+Math.random()*10);
    v=Math.max(1,Math.min(100,v));

    row.querySelector(".bar div").style.width=v+"%";
    row.querySelector(".value").textContent=v+"%";
  });
}

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

function updateAnalysis(ai){

  const order=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=order[0].i;
  const sub=order[1].i;
  const third=order[2].i;

  let text="";

  if(main===1){
    text=`スタート踏み込む1コースが先マイ体勢。
握って回る${sub}コースが差しで続き内有利の決着濃厚。
${third}コースは展開待ちで三着争いまで。
外枠勢は展開向かず厳しい一戦となりそうだ。`;
  }
  else if(main<=3){
    text=`${main}コースが攻めて主導権を奪う展開。
${sub}コースが内から抵抗し激しい攻防戦。
${third}コースが展開突いて浮上。
波乱含みのレース展開となりそうだ。`;
  }
  else{
    text=`外枠勢が果敢に仕掛け主導権争い。
${main}コースのまくり差しが決まる可能性。
${sub}コースが続き高配当も視野。
イン勢は苦戦必至の流れだ。`;
  }

  document.querySelector(".analysis-text").textContent=text;
  }
