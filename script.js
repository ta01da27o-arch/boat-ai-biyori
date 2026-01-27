/* =========================
   24場 正式名称
========================= */

const stadiums = [
 "桐生","戸田","江戸川","平和島","多摩川","浜名湖",
 "蒲郡","常滑","津","三国","びわこ","住之江",
 "尼崎","鳴門","丸亀","児島","宮島","徳山",
 "下関","若松","芦屋","福岡","唐津","大村"
];

/* =========================
   初期画面生成
========================= */

const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");

stadiums.forEach((name,i)=>{
 const btn=document.createElement("div");
 btn.className="stadium";
 btn.textContent=name;
 btn.onclick=()=>openRace(i);
 stadiumGrid.appendChild(btn);
});

function openRace(index){
 document.getElementById("stadiumScreen").classList.add("hidden");
 document.getElementById("raceScreen").classList.remove("hidden");

 raceGrid.innerHTML="";

 for(let i=1;i<=12;i++){
  const r=document.createElement("div");
  r.className="race";
  r.textContent=i+"R";
  r.onclick=()=>openPlayer(stadiums[index]+" "+i+"R");
  raceGrid.appendChild(r);
 }

 document.getElementById("raceTitle").textContent=stadiums[index];
}

document.getElementById("backBtn").onclick=()=>{
 document.getElementById("raceScreen").classList.add("hidden");
 document.getElementById("stadiumScreen").classList.remove("hidden");
};

function openPlayer(title){
 document.getElementById("raceScreen").classList.add("hidden");
 document.getElementById("playerScreen").classList.remove("hidden");
 document.querySelector("#playerScreen h2").textContent=title;

 generateExpectationBars();
 randomizeAll();
}

/* =========================
   総合期待度 3本バー生成
========================= */

function generateExpectationBars(){

 document.querySelectorAll(".expectation-bar").forEach(bar=>{
  bar.innerHTML=`
   <div class="bar-line">
    <span class="bar-label">実績</span>
    <div class="attack-base"></div>
   </div>
   <div class="bar-line">
    <span class="bar-label">予測</span>
    <div class="attack-predict"></div>
   </div>
   <div class="bar-line">
    <span class="bar-label">AI</span>
    <div class="attack-ai"></div>
   </div>
  `;
 });

}

/* =========================
   ダミー数値生成（確認用）
========================= */

function randomizeAll(){

 document.querySelectorAll(".kimarite-row").forEach(row=>{
  const v=Math.floor(Math.random()*80)+10;
  row.querySelector(".bar div").style.width=v+"%";
  row.querySelector(".value").textContent=v+"%";
 });

 document.querySelectorAll(".expectation-row").forEach(row=>{

  const base=Math.floor(Math.random()*70)+10;
  const predict=Math.floor(Math.random()*70)+10;
  const ai=Math.floor(Math.random()*70)+10;

  row.querySelector(".attack-base").style.width=base+"%";
  row.querySelector(".attack-predict").style.width=predict+"%";
  row.querySelector(".attack-ai").style.width=ai+"%";

  row.dataset.ai=ai;
  row.querySelector(".expectation-value").textContent=ai+"%";

 });

 buildBets();
}

/* =========================
   買い目 自動構築（横1/3配置）
========================= */

function buildBets(){

 const rows=[...document.querySelectorAll(".expectation-row")];
 rows.sort((a,b)=>b.dataset.ai-a.dataset.ai);

 const main=[
  rows[0].querySelector(".course-no").textContent,
  rows[1].querySelector(".course-no").textContent,
  rows[2].querySelector(".course-no").textContent
 ];

 const sub=[
  rows[1].querySelector(".course-no").textContent,
  rows[2].querySelector(".course-no").textContent,
  rows[3].querySelector(".course-no").textContent
 ];

 const esc=[
  "1",
  rows[1].querySelector(".course-no").textContent,
  rows[2].querySelector(".course-no").textContent
 ];

 const betBox=document.querySelector(".bet-box");

 betBox.innerHTML=`
 <div style="display:flex;width:100%;gap:8px;">

  <div style="flex:1;text-align:center;">
   <b>本命</b>
   <div>${main[0]}-${main[1]}-${main[2]}</div>
   <div>${main[0]}-${main[2]}-${main[1]}</div>
   <div>${main[1]}-${main[0]}-${main[2]}</div>
  </div>

  <div style="flex:1;text-align:center;">
   <b>対抗</b>
   <div>${sub[0]}-${sub[1]}-${sub[2]}</div>
   <div>${sub[0]}-${sub[2]}-${sub[1]}</div>
   <div>${sub[1]}-${sub[0]}-${sub[2]}</div>
  </div>

  <div style="flex:1;text-align:center;">
   <b>逃げ</b>
   <div>${esc[0]}-${esc[1]}-${esc[2]}</div>
   <div>${esc[0]}-${esc[2]}-${esc[1]}</div>
   <div>${esc[1]}-${esc[0]}-${esc[2]}</div>
  </div>

 </div>
 `;
}

/* =========================
   初期安全呼び出し
========================= */

if(document.querySelector(".expectation-bar")){
 generateExpectationBars();
 randomizeAll();
}