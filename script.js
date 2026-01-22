// =====================
// DOM読み込み後に実行（重要）
// =====================
document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // DOM取得
  // =====================
  const stadiumScreen = document.getElementById('stadiumScreen');
  const raceScreen = document.getElementById('raceScreen');
  const playerScreen = document.getElementById('playerScreen');
  const kimariteScreen = document.getElementById('kimariteScreen');

  const stadiumGrid = document.querySelector('.stadium-grid');
  const raceGrid = document.querySelector('.race-grid');

  const raceTitle = document.getElementById('raceTitle');
  const backBtn = document.getElementById('backBtn');

  // 保険（nullチェック）
  if (!stadiumGrid || !raceGrid) {
    console.error('DOM取得失敗');
    return;
  }

  // =====================
  // データ
  // =====================
  const stadiums = [
    '桐生','戸田','江戸川','平和島',
    '多摩川','浜名湖','蒲郡','常滑',
    '津','三国','びわこ','住之江',
    '尼崎','鳴門','丸亀','児島',
    '宮島','徳山','下関','若松',
    '芦屋','福岡','唐津','大村'
  ];

  // =====================
  // 初期化
  // =====================
  createStadiumButtons();

  // =====================
  // 24場ボタン生成
  // =====================
  function createStadiumButtons() {
    stadiumGrid.innerHTML = '';

    stadiums.forEach(name => {
      const btn = document.createElement('div');
      btn.className = 'stadium';
      btn.textContent = name;

      btn.addEventListener('click', () => {
        selectStadium(btn, name);
      });

      stadiumGrid.appendChild(btn);
    });
  }

  // =====================
  // 場選択
  // =====================
  function selectStadium(btn, stadiumName) {
    document.querySelectorAll('.stadium').forEach(el => {
      el.classList.remove('candidate');
    });

    btn.classList.add('candidate');

    // 見出しは「場名のみ」
    raceTitle.textContent = stadiumName;

    stadiumScreen.classList.add('hidden');
    raceScreen.classList.remove('hidden');

    createRaceButtons();
  }

  // =====================
  // レース番号生成
  // =====================
  function createRaceButtons() {
    raceGrid.innerHTML = '';

    for (let i = 1; i <= 12; i++) {
      const btn = document.createElement('div');
      btn.className = 'race';
      btn.textContent = `${i}R`;

      btn.addEventListener('click', () => {
        selectRace(btn);
      });

      raceGrid.appendChild(btn);
    }
  }

  // =====================
  // レース選択
  // =====================
  function selectRace(btn) {
    document.querySelectorAll('.race').forEach(el => {
      el.classList.remove('candidate');
    });

    btn.classList.add('candidate');

    playerScreen.classList.remove('hidden');
    kimariteScreen.classList.remove('hidden');
  }

  // =====================
  // 戻るボタン
  // =====================
  backBtn.addEventListener('click', () => {
    raceScreen.classList.add('hidden');
    stadiumScreen.classList.remove('hidden');

    document.querySelectorAll('.stadium').forEach(el => {
      el.classList.remove('candidate');
    });

    raceGrid.innerHTML = '';
    playerScreen.classList.add('hidden');
    kimariteScreen.classList.add('hidden');
  });

});