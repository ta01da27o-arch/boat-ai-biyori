const stadiums = [
  "桐生","戸田","江戸川","平和島","多摩川","浜名湖",
  "蒲郡","常滑","津","三国","びわこ","住之江",
  "尼崎","鳴門","丸亀","児島","宮島","徳山",
  "下関","若松","芦屋","福岡","唐津","大村"
];

const stadiumView = document.getElementById("stadiumView");
const predictView = document.getElementById("predictView");
const grid = document.getElementById("stadiumGrid");
const stadiumName = document.getElementById("stadiumName");
const courseRows = document.getElementById("courseRows");
const backBtn = document.getElementById("backBtn");
const arrivalRate = document.getElementById("arrivalRate");

// 24場生成
stadiums.forEach(name => {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = name;
  div.onclick = () => openPredict(name);
  grid.appendChild(div);
});

function openPredict(name) {
  stadiumName.textContent = name;
  stadiumView.classList.remove("active");
  predictView.classList.add("active");
  generateRows();
}

backBtn.onclick = () => {
  predictView.classList.remove("active");
  stadiumView.classList.add("active");
};

// コース行生成
function generateRows() {
  courseRows.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>${i}</div>
      <div><select><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select></div>
      <div><select><option>0</option><option>1</option><option>2</option></select></div>
      <div><input></div>
      <div><input></div>
      <div class="decision">決</div>
      <div><input></div>
      <div><input></div>
      <div><input></div>
    `;
    courseRows.appendChild(row);
  }
  arrivalRate.textContent = "1着:33% / 2着:33% / 3着:34%";
}