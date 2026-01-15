// 開催場データ（仮）
const stadiums = [
  "桐生", "戸田", "江戸川", "平和島",
  "多摩川", "浜名湖", "蒲郡", "常滑",
  "津", "三国", "びわこ", "住之江",
  "尼崎", "鳴門", "丸亀", "児島",
  "宮島", "徳山", "下関", "若松",
  "芦屋", "福岡", "唐津", "大村"
];

const select = document.getElementById("stadiumSelect");
const predictionDiv = document.getElementById("prediction");
const button = document.getElementById("predictBtn");

// セレクトボックス生成
stadiums.forEach(stadium => {
  const option = document.createElement("option");
  option.value = stadium;
  option.textContent = stadium;
  select.appendChild(option);
});

// 予測ボタン
button.addEventListener("click", () => {
  const stadium = select.value;

  // 仮の予測ロジック
  const patterns = ["逃げ", "差し", "まくり"];
  const result = patterns[Math.floor(Math.random() * patterns.length)];

  predictionDiv.textContent = `${stadium}：本命は「${result}」`;
});