const stadiums = [
  { name: "桐生", good: true },
  { name: "戸田", good: false },
  { name: "江戸川", good: true },
  { name: "平和島", good: false }
];

const courseColors = [
  "#ffffff", // 1
  "#000000", // 2
  "#f44336", // 3
  "#2196f3", // 4
  "#ffeb3b", // 5
  "#4caf50"  // 6
];

const grid = document.getElementById("stadiumGrid");

stadiums.forEach(s => {
  const div = document.createElement("div");
  div.className = "stadium" + (s.good ? " good" : "");
  div.textContent = s.name;
  div.onclick = () => openRaces(s.name);
  grid.appendChild(div);
});

function openRaces(name) {
  grid.classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
  document.getElementById("stadiumName").textContent = name;

  const raceBtns = document.getElementById("raceButtons");
  raceBtns.innerHTML = "";

  for (let i = 1; i <= 12; i++) {
    const b = document.createElement("button");
    b.className = "race-btn" + (i === 4 || i === 8 ? " good" : "");
    b.textContent = i + "R";
    b.onclick = () => openPredict(name, i);
    raceBtns.appendChild(b);
  }
}

function openPredict(name, race) {
  document.getElementById("raceScreen").classList.add("hidden");
  document.getElementById("predictScreen").classList.remove("hidden");
  document.getElementById("raceTitle").textContent = `${name} ${race}R`;

  // 決まり手
  const k = document.getElementById("kimarite");
  k.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const box = document.createElement("div");
    box.className = "kimarite-box";
    box.innerHTML = `<strong>${i+1}コース</strong>`;
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = (30 + i * 8) + "%";
    bar.style.background = courseColors[i];
    box.appendChild(bar);
    box.innerHTML += ` ${(30 + i * 8)}%`;
    k.appendChild(box);
  }

  // 期待値
  const e = document.getElementById("expectation");
  e.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const box = document.createElement("div");
    box.className = "expect-box";
    const bar = document.createElement("div");
    bar.className = "expect-bar";
    bar.style.width = (40 + i * 6) + "%";
    bar.style.background = courseColors[i];
    bar.textContent = `${i+1}コース`;
    box.appendChild(bar);
    e.appendChild(box);
  }

  // 展開
  document.getElementById("analysis").textContent =
    "1コースのスタートに不安。4・5コースが機力優勢で捲り攻め。2コースは差し残し注意。";

  // 買い目（重複なし）
  document.getElementById("bets").innerHTML = `
    <li>4-5-2</li>
    <li>5-4-2</li>
    <li>4-2-5</li>
  `;
}

function backToGrid() {
  document.getElementById("raceScreen").classList.add("hidden");
  grid.classList.remove("hidden");
}

function backToRace() {
  document.getElementById("predictScreen").classList.add("hidden");
  document.getElementById("raceScreen").classList.remove("hidden");
}