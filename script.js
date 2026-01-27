// ================================
// 画面制御
// ================================

const stadiumScreen = document.getElementById("stadiumScreen");
const raceScreen = document.getElementById("raceScreen");
const playerScreen = document.getElementById("playerScreen");

const stadiumGrid = document.querySelector(".stadium-grid");
const raceGrid = document.querySelector(".race-grid");
const backBtn = document.getElementById("backBtn");
const raceTitle = document.getElementById("raceTitle");

const stadiums = Array.from({length:24},(_,i)=>`第${i+1}場`);

stadiums.forEach(name=>{
  const btn=document.createElement("div");
  btn.className="stadium";
  btn.textContent=name;
  btn.onclick=()=>openRace(name);
  stadiumGrid.appendChild(btn);
});

function openRace(name){
 stadiumScreen.classList.add("hidden");
 raceScreen.classList.remove("hidden");
 raceTitle.textContent=name;

 raceGrid.innerHTML="";
 for(let i=1;i<=12;i++){
  const btn=document.createElement("div");
  btn.className="race";
  btn.textContent=`${i}R`;
  btn.onclick=()=>openPlayer(i);
  raceGrid.appendChild(btn);
 }
}

function openPlayer(race){
 raceScreen.classList.add("hidden");
 playerScreen.classList.remove("hidden");
}

backBtn.onclick=()=>{
 raceScreen.classList.add("hidden");
 stadiumScreen.classList.remove("hidden");
};

// ================================
// グラフラベル自動生成
// ================================

function setupBarLabels(){
 document.querySelectorAll(".expectation-bar").forEach(bar=>{
  if(bar.querySelector(".bar-line")) return;

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

// ================================
// 仮データ生成（後で実データ可）
// ================================

function rand(){
 return Math.floor(Math.random()*60)+20;
}

function injectDummy(){

 document.querySelectorAll(".kimarite-row").forEach(row=>{
  const v=rand();
  row.querySelector(".bar div").style.width=v+"%";
  row.querySelector(".value").textContent=v+"%";
 });

}

// ================================
// 総合期待度計算＆表示
// ================================

function calcExpectation(){

 document.querySelectorAll(".expectation-row").forEach(row=>{

  const base=rand();
  const predict=rand();
  const ai=Math.floor((base+predict)/2+Math.random()*10);

  row.querySelector(".attack-base").style.width=base+"%";
  row.querySelector(".attack-predict").style.width=predict+"%";
  row.querySelector(".attack-ai").style.width=ai+"%";

  // 右端固定数値（AI）
  row.querySelector(".expectation-value").textContent=ai+"%";

  row.dataset.ai=ai;

 });

 buildBets();
}

// ================================
// 買い目生成（本命・対抗・逃げ）
// ================================

function buildBets(){

 const rows=[...document.querySelectorAll(".expectation-row")];

 rows.sort((a,b)=>b.dataset.ai-a.dataset.ai);

 const main=[rows[0],rows[1],rows[2]].map(r=>r.querySelector(".course-no").textContent);
 const sub=[rows[1],rows[2],rows[3]].map(r=>r.querySelector(".course-no").textContent);
 const escape=["1",rows[1].querySelector(".course-no").textContent,rows[2].querySelector(".course-no").textContent];

 const betBox=document.querySelector(".bet-box");
 betBox.innerHTML=`
  <div class="bet-column">
    <h3>本命</h3>
    <div>${main[0]}-${main[1]}-${main[2]}</div>
    <div>${main[0]}-${main[2]}-${main[1]}</div>
    <div>${main[1]}-${main[0]}-${main[2]}</div>
  </div>

  <div class="bet-column">
    <h3>対抗</h3>
    <div>${sub[0]}-${sub[1]}-${sub[2]}</div>
    <div>${sub[0]}-${sub[2]}-${sub[1]}</div>
    <div>${sub[1]}-${sub[0]}-${sub[2]}</div>
  </div>

  <div class="bet-column">
    <h3>逃げ</h3>
    <div>${escape[0]}-${escape[1]}-${escape[2]}</div>
    <div>${escape[0]}-${escape[2]}-${escape[1]}</div>
    <div>${escape[1]}-${escape[0]}-${escape[2]}</div>
  </div>
 `;
}

// ================================
// 展開タイプ＋解析
// ================================

function updateRaceType(){

 const aiValues=[...document.querySelectorAll(".expectation-row")]
  .map(r=>Number(r.dataset.ai));

 const max=Math.max(...aiValues);

 let type="混戦";

 if(max>80) type="本命堅め";
 else if(max<50) type="大波乱";

 document.getElementById("race-type").textContent="展開タイプ："+type;

 document.querySelector(".analysis-text").textContent=
  type==="本命堅め"
   ?"イン中心で堅い展開が濃厚。主導権は内枠。"
   :type==="大波乱"
   ?"スタート混戦で外枠台頭の可能性あり。"
   :"各艇拮抗。展開次第で着順変動。";
}

// ================================
// 初期起動
// ================================

setTimeout(()=>{
 setupBarLabels();
 injectDummy();
 calcExpectation();
 updateRaceType();
},300);