// app.js
// データ読み込み・UI反映を制御

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("venuesGrid");
  const dateLabel = document.getElementById("dateLabel");
  const refreshBtn = document.getElementById("refreshBtn");

  dateLabel.textContent = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  async function loadRaceData() {
    try {
      const res = await fetch("./data/data.json");
      const data = await res.json();

      grid.innerHTML = "";
      data.forEach((v) => {
        const card = document.createElement("div");
        card.className = "venue-card clickable";
        card.innerHTML = `
          <div class="v-name">${v.name}</div>
          <div class="v-status active">開催中</div>
          <a href="${v.url}" target="_blank" style="font-size:12px;">出走表を開く</a>
        `;
        grid.appendChild(card);
      });
    } catch (e) {
      grid.innerHTML = `<div style="padding:20px;">データを取得できませんでした。</div>`;
      console.error(e);
    }
  }

  refreshBtn.addEventListener("click", loadRaceData);

  loadRaceData();
});
