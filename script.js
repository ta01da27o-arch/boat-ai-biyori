document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     決まり手％を取得
  ============================ */

  function getKimariteValues(course) {

    const rows = document.querySelectorAll(
      `.kimarite-course.c${course} .kimarite-row`
    );

    const data = {};

    rows.forEach(row => {
      const label = row.querySelector(".label").textContent.trim();
      const valueText = row.querySelector(".value").textContent.replace("%", "");
      const value = parseFloat(valueText) || 0;

      data[label] = value;
    });

    return data;
  }

  /* ============================
     各コース期待度計算
  ============================ */

  function calculateExpectation(course) {

    const k = getKimariteValues(course);
    let score = 0;

    // 1コース
    if (course === 1) {
      score =
        (k["逃げ"] || 0) * 1.2 -
        (k["差され"] || 0) * 0.6 -
        (k["捲られ"] || 0) * 0.6 -
        (k["捲差"] || 0) * 0.4;
    }

    // 2コース
    else if (course === 2) {
      score =
        (k["差し"] || 0) * 1.0 +
        (k["捲り"] || 0) * 0.6 -
        (k["逃がし"] || 0) * 0.4;
    }

    // 3〜6コース
    else {
      score =
        (k["差し"] || 0) * 0.8 +
        (k["捲り"] || 0) * 1.0 +
        (k["捲差"] || 0) * 0.7;
    }

    return Math.max(score, 0);
  }

  /* ============================
     総合期待度 更新
  ============================ */

  function updateExpectations() {

    const rawScores = [];

    for (let i = 1; i <= 6; i++) {
      rawScores.push(calculateExpectation(i));
    }

    const maxScore = Math.max(...rawScores, 1);

    rawScores.forEach((score, index) => {

      const percent = Math.round((score / maxScore) * 100);

      const row = document.querySelector(
        `.expectation-row.c${index + 1}`
      );

      const bar = row.querySelector(".expectation-bar div");
      const value = row.querySelector(".expectation-value");

      bar.style.width = percent + "%";
      value.textContent = percent + "%";
    });
  }

  /* ============================
     自動監視（数値変更で再計算）
  ============================ */

  const observer = new MutationObserver(updateExpectations);

  document.querySelectorAll(".value").forEach(el => {
    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true
    });
  });

  /* ============================
     初回実行
  ============================ */

  updateExpectations();

});