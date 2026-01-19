function renderExpectation(){
  const e = document.getElementById("expectation");
  e.innerHTML = "";

  for(let c=1;c<=6;c++){
    // 仮の期待値（後に実データ×ST×展開に置換）
    const v = Math.floor(Math.random()*50)+20;

    const row = document.createElement("div");
    row.className = "expect-bar";

    row.innerHTML = `
      <div style="width:70px;font-weight:bold">
        ${c}コース
      </div>
      <div style="
        height:18px;
        width:${v}%;
        background:${colors[c]};
        border-radius:6px;
        margin-right:6px;
        border:1px solid #333;
      "></div>
      <div>${v}%</div>
    `;

    e.appendChild(row);
  }
}