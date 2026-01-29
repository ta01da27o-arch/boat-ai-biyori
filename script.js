// ===============================
// 24場
// ===============================
const stadiums = [
 "桐生","戸田","江戸川","平和島","多摩川","浜名湖","蒲郡","常滑",
 "津","三国","びわこ","住之江","尼崎","鳴門","丸亀","児島",
 "宮島","徳山","下関","若松","芦屋","福岡","唐津","大村"
];

let selectedStadium = 0;

// ===============================
// 初期生成
// ===============================
const stadiumGrid=document.querySelector(".stadium-grid");
const raceGrid=document.querySelector(".race-grid");

stadiums.forEach((n,i)=>{
 const d=document.createElement("div");
 d.className="stadium";
 d.textContent=n;
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
 calcAll();
}

// ===============================
// 完全連動中核AI
// ===============================
function generateAI(){

 let power=[];

 for(let i=0;i<6;i++){
  let v=50+Math.random()*25;

  if(i===0) v+=12;
  if(i===1) v+=6;
  if(i>=4) v-=6;

  power.push(clamp(Math.round(v)));
 }

 return normalize(power);
}

// ===============================
// メイン連動処理
// ===============================
function calcAll(){

 const ai = generateAI();

 const base = ai.map(v=>clamp(v+rand(-6,6)));
 const predict = ai.map(v=>clamp(v+rand(-8,8)));

 const kimarite = generateKimarite(ai);

 updateKimarite(kimarite);
 updateExpectation(base,predict,ai);
 updateRaceType(ai);
 updateAnalysis(ai);
 updateBets(ai);
 updateHitRate(base,predict,ai);
 updateTrust(ai);
}

// ===============================
// 決まり手（AI連動正規化）
// ===============================
function generateKimarite(ai){

 let raw=[
  ai[0]*1.5,
  ai[1]*1.2,
  ai[2]*1.0,
  ai[3]*0.9,
  ai[4]*0.8,
  ai[5]*0.7
 ];

 const sum=raw.reduce((a,b)=>a+b,0);
 return raw.map(v=>Math.round(v/sum*100));
}

function updateKimarite(arr){

 const rows=document.querySelectorAll(".kimarite-row");

 rows.forEach((r,i)=>{
  const v=arr[i%6];
  r.querySelector(".bar div").style.width=v+"%";
  r.querySelector(".value").textContent=v+"%";
 });
}

// ===============================
// 総合期待度（色付き連動）
// ===============================
function updateExpectation(base,predict,ai){

 document.querySelectorAll(".expectation-row").forEach((row,i)=>{

  const box=row.querySelector(".expectation-bar");
  box.innerHTML="";

  const data=[
   {v:base[i],c:"#4caf50"},
   {v:predict[i],c:"#2196f3"},
   {v:ai[i],c:"#ff9800"}
  ];

  data.forEach(d=>{
   const wrap=document.createElement("div");
   wrap.style.height="12px";
   wrap.style.background="#ddd";
   wrap.style.marginBottom="4px";
   wrap.style.position="relative";

   const bar=document.createElement("div");
   bar.style.height="100%";
   bar.style.width=d.v+"%";
   bar.style.background=d.c;

   const txt=document.createElement("span");
   txt.textContent=d.v+"%";
   txt.style.position="absolute";
   txt.style.right="4px";
   txt.style.fontSize="11px";

   wrap.appendChild(bar);
   wrap.appendChild(txt);
   box.appendChild(wrap);
  });

  row.querySelector(".expectation-value").textContent=ai[i]+"%";
 });
}

// ===============================
// 展開タイプ
// ===============================
function updateRaceType(ai){

 const inner=ai[0];
 const mid=(ai[1]+ai[2]+ai[3])/3;
 const outer=(ai[4]+ai[5])/2;

 let t="バランス型";

 if(inner>mid+10) t="イン逃げ主導型";
 else if(mid>inner+8) t="中枠攻め型";
 else if(outer>mid+8) t="外伸び波乱型";

 document.getElementById("race-type").textContent="展開タイプ : "+t;
}

// ===============================
// 展開解析
// ===============================
function updateAnalysis(ai){

 const s=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 let txt="";

 if(s[0].i===1) txt="イン逃げが中心となる堅め展開。";
 else if(s[0].i<=3) txt="中枠から展開が動く流れ。";
 else txt="外枠浮上の波乱展開。";

 txt+=`\n軸:${s[0].i}コース 相手:${s[1].i}コース`;

 document.querySelector(".analysis-text").textContent=txt;
}

// ===============================
// 買い目（完全AI連動）
// ===============================
function updateBets(ai){

 const s=ai.map((v,i)=>({v,i:i+1})).sort((a,b)=>b.v-a.v);

 const main=s[0].i;
 const sub=s[1].i;
 const third=s[2].i;

 const cols=document.querySelectorAll(".bet-col");

 setCol(cols[0],[`${main}-${sub}-${third}`,`${main}-${third}-${sub}`,`${sub}-${main}-${third}`]);
 setCol(cols[1],[`${sub}-${main}-${third}`,`${third}-${main}-${sub}`,`${sub}-${third}-${main}`]);
 setCol(cols[2],[`${main}-${sub}-${third}`,`${main}-${third}-${sub}`,`${main}-${sub}-${third}`]);
}

function setCol(col,arr){
 col.querySelectorAll(".bet-item").forEach((e,i)=>e.textContent=arr[i]||"");
}

// ===============================
// 的中率シミュレーション
// ===============================
function updateHitRate(base,predict,ai){

 document.querySelectorAll(".hitrate-row").forEach((r,i)=>{
  const rate=Math.round((base[i]+predict[i]+ai[i])/3);
  r.querySelector(".hitrate-value").textContent=rate+"%";
  r.querySelector(".hitrate-bar div").style.width=rate+"%";
 });
}

// ===============================
// 信頼度メーター
// ===============================
function updateTrust(ai){

 const max=Math.max(...ai);
 const min=Math.min(...ai);
 const avg=ai.reduce((a,b)=>a+b,0)/6;

 const solidity=clamp(Math.round((max-min)*1.3));
 const variance=ai.reduce((s,v)=>s+Math.abs(v-avg),0)/6;
 const volatility=clamp(Math.round(variance*1.4));

 let trust=solidity-volatility;
 if(trust<0) trust=0;

 let box=document.getElementById("confidenceSection");

 if(!box){
  box=document.createElement("section");
  box.id="confidenceSection";
  document.getElementById("playerScreen").appendChild(box);
 }

 box.innerHTML=`
 <h2>信頼度メーター</h2>
 ${trustRow("堅さ",solidity,"#4caf50")}
 ${trustRow("荒れ指数",volatility,"#f44336")}
 ${trustRow("総合信頼度",trust,"#ffc107")}
 `;
}

function trustRow(l,v,c){
 return `
 <div style="display:flex;align-items:center;margin-bottom:6px;">
  <span style="width:90px">${l}</span>
  <div style="flex:1;height:14px;background:#ddd;margin:0 6px;">
   <div style="width:${v}%;height:100%;background:${c};"></div>
  </div>
  <span>${v}%</span>
 </div>`;
}

// ===============================
// 補助
// ===============================
function rand(min,max){
 return Math.floor(Math.random()*(max-min+1))+min;
}

function clamp(v){
 if(v<0) return 0;
 if(v>100) return 100;
 return v;
}

function normalize(arr){
 const max=Math.max(...arr);
 return arr.map(v=>clamp(Math.round(v/max*100)));
}
/* =====================================
   総合期待度 完全再現 強制上書きパッチ
   （末尾追加専用）
===================================== */

// clamp保険
if(typeof clamp!=="function"){
 window.clamp=(v)=>Math.max(0,Math.min(100,v));
}

// ---- AI生成 上書き ----
window.generateAI=function(){

 let arr=[];

 for(let i=0;i<6;i++){

  let v=45 + Math.random()*35;

  if(i===0) v+=10;
  if(i===5) v-=8;

  arr.push(Math.round(clamp(v)));
 }

 return arr;
};

// ---- 総合期待度描画 強制差し替え ----
window.updateExpectation=function(base,predict,ai){

 const colors=[
  "#ff5252",
  "#ff9800",
  "#ffeb3b",
  "#8bc34a",
  "#03a9f4",
  "#9c27b0"
 ];

 document.querySelectorAll(".expectation-row").forEach((row,i)=>{

  const box=row.querySelector(".expectation-bar");
  box.innerHTML="";

  const sets=[
    ["実績",base[i]],
    ["予測",predict[i]],
    ["AI",ai[i]]
  ];

  sets.forEach(s=>{

   const wrap=document.createElement("div");
   wrap.style.display="flex";
   wrap.style.alignItems="center";
   wrap.style.marginBottom="5px";

   const label=document.createElement("span");
   label.textContent=s[0];
   label.style.width="40px";
   label.style.fontSize="12px";

   const barWrap=document.createElement("div");
   barWrap.style.flex="1";
   barWrap.style.height="12px";
   barWrap.style.background="#ddd";
   barWrap.style.position="relative";
   barWrap.style.borderRadius="6px";
   barWrap.style.overflow="hidden";

   const bar=document.createElement("div");
   bar.style.height="100%";
   bar.style.width=s[1]+"%";
   bar.style.background=colors[i];

   const value=document.createElement("span");
   value.textContent=s[1]+"%";
   value.style.position="absolute";
   value.style.right="6px";
   value.style.top="-1px";
   value.style.fontSize="11px";

   barWrap.appendChild(bar);
   barWrap.appendChild(value);

   wrap.appendChild(label);
   wrap.appendChild(barWrap);

   box.appendChild(wrap);

  });

  row.querySelector(".expectation-value").textContent=ai[i]+"%";
 });

};

console.log("✅ 総合期待度 完全連動パッチ適用済み");