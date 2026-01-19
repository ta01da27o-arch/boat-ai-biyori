function renderExpectation(){
  const e = document.getElementById("expectation");
  e.innerHTML = "";

  for(let c=1;c<=6;c++){
    const v = Math.floor(Math.random()*50)+20;

    const row = document.createElement("div");
    row.style.cssText = `
      display:flex;
      align-items:center;
      padding:6px;
      margin-bottom:6px;
      border-radius:8px;
      background:${colors[c]};
      border:1px solid #333;
    `;

    row.innerHTML = `
      <div style="width:70px;font-weight:bold">
        ${c}コース
      </div>
      <div style="
        height:18px;
        width:${v}%;
        background:rgba(0,0,0,0.25);
        border-radius:6px;
        border:1px solid #333;
        margin-right:6px;
      "></div>
      <div style="font-size:12px">${v}%</div>
    `;

    e.appendChild(row);
  }
}