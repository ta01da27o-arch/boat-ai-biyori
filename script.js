// ===============================
// 24場名
// ===============================
const stadiums = [
  "桐生","戸田","江戸川","平和島","多摩川","浜名湖","蒲郡","常滑",
  "津","三国","びわこ","住之江","尼崎","鳴門","丸亀","児島",
  "宮島","徳山","下関","若松","芦屋","福岡","唐津","大村"
];

let selectedStadium = 0;

// ===============================
// 初期表示
// ===============================
const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

stadiums.forEach((name,i)=>{
  const d=document.createElement("div");
  d.className="stadium";
  d.textContent=name;
  d.onclick=()=>selectStadium(i);
  stadiumGrid.appendChild(d);
});

for(let i=1;i<=12;i++){
  const r=document.createElement("div");
  r.className="race";
  r.textContent=i+"R";
  r.onclick=()=>selectRace();
  raceGrid.appendChild(r);
}

document.getElementById("backBtn").onclick=()=>{
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("stadiumScreen").classList.remove("hidden");
};

// ===============================
// 画面遷移
// ===============================
function selectStadium(i){
  selectedStadium=i;
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent=stadiums[i];
}

function selectRace(){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");
  calcAllLinked();
}

// ===============================
// ★ 完全連動データ生成
// ===============================
function generateTruePower(){

  let arr=[];
  for(let i=0;i<6;i++){

    let base = 45 + Math.random()*30;

    // 内枠有利補正
    if(i===0) base+=8;
    if(i===1) base+=4;
    if(i>=4) base-=4;

    arr.push(Math.round(base));
  }

  return arr;
}

// ===============================
// メイン処理
// ===============================
function calcAllLinked(){

  const truePower = generateTruePower();

  // ----------------------------
  // 実績・予測生成（連動）
  // ----------------------------
  let base=[];
  let predict=[];

  truePower.forEach(v=>{
    base.push(clamp(v + rand(-6,6)));
    predict.push(clamp(v + rand(-8,8)));
  });

  // ----------------------------
  // 決まり手連動生成
  // ----------------------------
  const kimariteAdv = generateKimarite(truePower);

  // ----------------------------
  // AI期待度（完全連動）
  // ----------------------------
  let ai=[];

  for(let i=0;i<6;i++){
    const val = Math.round(
      base[i]*0.4 +
      predict[i]*0.4 +
      kimariteAdv[i]*0.2
    );
    ai.push(clamp(val));
  }

  // ----------------------------
  // 表示反映
  // ----------------------------
  updateExpectationBars(base,predict,ai);
  updateKimariteBars(kimariteAdv);
  updateRaceType(ai);
  updateAnalysis(ai);
  updateBetsLinked(ai);
  updateHitRate(base,predict,ai);
  updateTrust(ai);
}

// ===============================
// ユーティリティ
// ===============================
function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function clamp(v){
  if(v<0) return 0;
  if(v>100) return 100;
  return v;
}

// ===============================
// 決まり手生成（正規化）
// ===============================
function generateKimarite(tp){

  let raw=[
    tp[0]*1.4,
    tp[1]*1.1,
    tp[2]*1.0,
    tp[3]*0.9,
    tp[4]*0.8,
    tp[5]*0.7
  ];

  const sum = raw.reduce((a,b)=>a+b,0);

  return raw.map(v=>Math.round(v/sum*100));
}

function updateKimariteBars(arr){

  const rows=document.querySelectorAll(".kimarite-row");

  rows.forEach((row,i)=>{
    const val = arr[i%6];
    row.querySelector(".bar div").style.width=val+"%";
    row.querySelector(".value").textContent=val+"%";
  });
}

// ===============================
// 総合期待度バー
// ===============================
function updateExpectationBars(base,predict,ai){

  const labels=["実績","予測","AI"];

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const box=row.querySelector(".expectation-bar");
    box.innerHTML="";

    [base[i],predict[i],ai[i]].forEach((v,j)=>{

      const line=document.createElement("div");
      line.style.display="flex";
      line.style.alignItems="center";
      line.style.marginBottom="4px";

      const lab=document.createElement("span");
      lab.textContent=labels[j];
      lab.style.width="50px";

      const out=document.createElement("div");
      out.style.flex="1";
      out.style.height="14px";
      out.style.border="1px solid #333";
      out.style.background="#eee";
      out.style.position="relative";
      out.style.borderRadius="4px";

      const bar=document.createElement("div");
      bar.style.height="100%";
      bar.style.width=v+"%";
      bar.style.background="#33cc66";

      const txt=document.createElement("span");
      txt.textContent=v+"%";
      txt.style.position="absolute";
      txt.style.right="4px";
      txt.style.fontSize="12px";

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
// 展開タイプ
// ===============================
function updateRaceType(ai){

  const inner=ai[0];
  const middle=(ai[1]+ai[2]+ai[3])/3;
  const outer=(ai[4]+ai[5])/2;

  let type="バランス型";

  if(inner>middle+10) type="イン逃げ主導型";
  else if(middle>inner+8) type="中枠攻め型";
  else if(outer>middle+8) type="外伸び波乱型";

  document.getElementById("race-type").textContent="展開タイプ : "+type;
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

  const sorted = ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=sorted[0].i;
  const sub=sorted[1].i;

  let text="";

  if(main===1) text="インコース主導で逃げ有利展開。";
  else if(main<=3) text="中枠中心で展開が動く流れ。";
  else text="外枠浮上で波乱含み。";

  text+=`\n軸は${main}コース、相手本線${sub}コース。`;

  document.querySelector(".analysis-text").textContent=text;
}

// ===============================
// 買い目完全連動
// ===============================
function updateBetsLinked(ai){

  const s = ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

  const main=s[0].i;
  const sub=s[1].i;
  const third=s[2].i;

  const others=[1,2,3,4,5,6].filter(n=>![main,sub,third].includes(n));

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

  if(cols[3]){
    setCol(cols[3],[
      `${others[0]}-${others[1]}-${others[2]}`,
      `${others[1]}-${others[0]}-${others[2]}`,
      `${others[2]}-${others[0]}-${others[1]}`
    ]);
  }
}

function setCol(col,arr){
  col.querySelectorAll(".bet-item").forEach((el,i)=>{
    el.textContent=arr[i]||"";
  });
}

// ===============================
// 的中率シミュレーション
// ===============================
function updateHitRate(base,predict,ai){

  const rows=document.querySelectorAll(".hitrate-row");

  rows.forEach((row,i)=>{

    const rate = Math.round((base[i]+predict[i]+ai[i])/3);

    const val=row.querySelector(".hitrate-value");
    const bar=row.querySelector(".hitrate-bar div");

    val.textContent=rate+"%";
    bar.style.width=rate+"%";
  });
}

// ===============================
// 信頼度メーター（完全連動）
// ===============================
function updateTrust(ai){

  const max=Math.max(...ai);
  const min=Math.min(...ai);

  const solidity = clamp(Math.round((max-min)*1.4));
  const avg = ai.reduce((a,b)=>a+b,0)/6;

  const variance = ai.reduce((s,v)=>s+Math.abs(v-avg),0)/6;
  const volatility = clamp(Math.round(variance*1.5));

  let trust = solidity - volatility;
  if(trust<0) trust=0;

  let box=document.getElementById("confidenceSection");

  if(!box){
    box=document.createElement("section");
    box.id="confidenceSection";
    document.getElementById("playerScreen").appendChild(box);
  }

  box.innerHTML=`
    <h2>信頼度メーター</h2>

    ${renderTrustRow("堅さ",solidity,"#33cc66")}
    ${renderTrustRow("荒れ指数",volatility,"#ff3333")}
    ${renderTrustRow("総合信頼度",trust,"#ffcc00")}
  `;
}

function renderTrustRow(label,val,color){
  return `
  <div style="display:flex;align-items:center;margin-bottom:6px;">
    <span style="width:90px">${label}</span>
    <div style="flex:1;height:14px;border:1px solid #333;background:#eee;border-radius:4px;margin:0 6px;">
      <div style="width:${val}%;height:100%;background:${color};border:1px solid #000;"></div>
    </div>
    <span>${val}%</span>
  </div>`;
}