const stadiums = [
  { name: "桐生", good: true },
  { name: "戸田", good: false },
  { name: "江戸川", good: true },
  { name: "平和島", good: false },
  { name: "蒲郡", good: false },
  { name: "住之江", good: true }
];

const grid = document.getElementById("stadiumGrid");
const detail = document.getElementById("detailArea");

/* 24場固定生成 */
stadiums.forEach(s => {
  const d = document.createElement("div");
  d.className = "stadium" + (s.good ? " good" : "");
  d.textContent = s.name;
  if (s.good) {
    d.onclick = () => loadDetail(s.name);
  }
  grid.appendChild(d);
});

function loadDetail(name) {
  detail.innerHTML = `
    <h3>${name}｜候補レース：4R</h3>

    <h4>選手番号入力</h4>
    <div class="inputRow">
      <input placeholder="1">
      <input placeholder="2">
      <input placeholder="3">
      <input placeholder="4">
      <input placeholder="5">
      <input placeholder="6">
    </div>

    <h4>各コース決まり手</h4>
    ${makeKimarite()}

    <h4>各コース入着期待値</h4>
    ${makeExpect()}

    <h4>⭐展開解析</h4>
    <p>
      1コースはスタートに不安。<br>
      4・5コースが機力優勢で捲り攻め。<br>
      2コースは差し残しに注意。
    </p>

    <h4>買い目</h4>
    <ul>
      <li>4-5-2</li>
      <li>5-4-2</li>
      <li>4-2-5</li>
    </ul>
  `;
}

function makeKimarite() {
  let html = "";
  for (let i = 1; i <= 6; i++) {
    const v = 20 + i * 10;
    html += `
      <div class="box">
        ${i}コース
        <div class="bar c${i}" style="width:${v}%"></div>
        ${v}%
      </div>
    `;
  }
  return html;
}

function makeExpect() {
  let html = "";
  for (let i = 1; i <= 6; i++) {
    const v = 30 + i * 8;
    html += `
      <div class="box">
        <div class="bar c${i}" style="width:${v}%">
          ${i}コース
        </div>
      </div>
    `;
  }
  return html;
}