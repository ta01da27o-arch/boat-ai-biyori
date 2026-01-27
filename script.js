// ===============================
// 24場名（正式）
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
  document.getElementById("stadiumScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent=stadiums[i];
}

function selectRace(r){
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("playerScreen").classList.remove("hidden");

  calcAll();
}

// ===============================
// メイン計算
// ===============================
function calcAll(){

  let base=[];
  let predict=[];
  let ai=[];

  for(let i=0;i<6;i++){
    const b = Math.floor(40+Math.random()*40);
    const p = Math.floor(35+Math.random()*45);
    const a = Math.round(b*0.4 + p*0.6);

    base.push(b);
    predict.push(p);
    ai.push(a);
  }

  updateExpectationBars(base,predict,ai);
  updateKimarite();
  updateRaceTypeByAI(ai);
  updateAnalysis(ai);
  updateBets(ai);
}

// ===============================
// ✅ 総合期待度（3本グラフ強化版）
// ===============================
function updateExpectationBars(base,predict,ai){

  document.querySelectorAll(".expectation-row").forEach((row,i)=>{

    const box = row.querySelector(".expectation-bar");

    // 初期化
    box.innerHTML = "";

    const data = [
      {label:"実績", value: base[i]},
      {label:"予測", value: predict[i]},
      {label:"AI", value: ai[i]}
    ];

    data.forEach(d=>{

      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.marginBottom = "4px";

      const lab = document.createElement("span");
      lab.textContent = d.label;
      lab.style.width = "40px";
      lab.style.fontSize = "12px";

      const barBox = document.createElement("div");
      barBox.style.flex = "1";
      barBox.style.height = "10px";
      barBox.style.border = "1px solid #aaa";
      barBox.style.marginRight = "6px";

      const bar = document.createElement("div");
      bar.style.height = "100%";
      bar.style.width = d.value + "%";
      bar.style.background = "#4caf50";

      barBox.appendChild(bar);

      const val = document.createElement("span");
      val.textContent = d.value + "%";
      val.style.fontSize = "12px";
      val.style.width = "35px";

      wrap.appendChild(lab);
      wrap.appendChild(barBox);
      wrap.appendChild(val);

      box.appendChild(wrap);
    });

    row.querySelector(".expectation-value").textContent = ai[i] + "%";
  });
}

// ===============================
// 決まり手グラフ（安全方式）
// ===============================
function updateKimarite(){

  document.querySelectorAll(".kimarite-row").forEach(row=>{

    const v = Math.floor(10 + Math.random()*75);

    const bar = row.querySelector(".bar div");
    const val = row.querySelector(".value");

    bar.style.width = v + "%";
    val.textContent = v + "%";
  });
}

// ===============================
// 展開タイプAI（実戦寄り）
// ===============================
function updateRaceTypeByAI(ai){

  const inner = ai[0];
  const middle = (ai[1]+ai[2]+ai[3])/3;
  const outer = (ai[4]+ai[5])/2;

  const max=Math.max(...ai);
  const min=Math.min(...ai);

  let type="";

  if(inner > middle+10 && inner > outer+15){
    type="イン逃げ主導型";
  }
  else if(middle > inner && middle > outer){
    type="中枠攻め合い型";
  }
  else if(outer > inner && outer > middle){
    type="外伸び波乱型";
  }
  else if(max-min < 8){
    type="超混戦型";
  }
  else{
    type="バランス型";
  }

  document.getElementById("race-type").textContent = "展開タイプ : " + type;
}

// ===============================
// 展開解析コメント
// ===============================
function updateAnalysis(ai){

  const order = ai
    .map((v,i)=>({v,i:i+1}))
    .sort((a,b)=>b.v-a.v);

  const main = order[0].i;
  const sub = order[1].i;

  let text="";

  if(main===1){
    text="1コースがスタート優勢。イン主導で展開は安定傾向。中枠は差し狙い。";
  }
  else if(main<=3){
    text="中枠勢が主導権争い。1コースは守勢で展開が動きやすい。";
  }
  else{
    text="外枠の伸びが優勢。スタート次第で高配当も十分狙える。";
  }

  text += `\n軸候補は ${main}コース。対抗は ${sub}コース。`;

  document.querySelector(".analysis-text").textContent = text;
}

// ===============================
// 買い目生成（3枠）
// ===============================
function updateBets(ai){

  const order = ai
    .map((v,i)=>({v,i:i+1}))
    .sort((a,b)=>b.v-a.v);

  const main = order[0].i;
  const sub = order[1].i;
  const third = order[2].i;

  const cols = document.querySelectorAll(".bet-col");

  setCol(cols[0],[
    `${main}-${sub}-${third}`,
    `${main}-${third}-${sub}`,
    `${sub}-${main}-${third}`
  ]);

  setCol(cols[1],[
    `${sub}-${third}-${main}`,
    `${sub}-${main}-${third}`,
    `${third}-${sub}-${main}`
  ]);

  setCol(cols[2],[
    `1-${sub}-${third}`,
    `1-${third}-${sub}`,
    `1-${sub}-${main}`
  ]);
}

function setCol(col,arr){
  const items = col.querySelectorAll(".bet-item");
  items.forEach((el,i)=>{
    el.textContent = arr[i] || "";
  });
}