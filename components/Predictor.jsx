import { useState } from "react";
import { players } from "../data/players";

export default function Predictor({ stadium, onBack }) {
  const [lanes, setLanes] = useState(
    Array.from({ length: 6 }, () => ({ number: "" }))
  );

  const update = (index, number) => {
    const data = players[number] || {};
    const copy = [...lanes];
    copy[index] = { number, ...data };
    setLanes(copy);
  };

  return (
    <div>
      <button onClick={onBack}>← 場選択へ</button>
      <h3>
        {stadium.name}（{stadium.feature}）
      </h3>

      {lanes.map((l, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: 6,
            marginBottom: 6,
            background: l.name ? "#f0fdf4" : "#f9fafb"
          }}
        >
          <b>{i + 1}コース</b>
          <input
            style={{ marginLeft: 8 }}
            placeholder="選手番号"
            value={l.number}
            onChange={e => update(i, e.target.value)}
          />

          {l.name && (
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {l.name} ｜ {l.grade} ｜ F:{l.f} ｜ 全:{l.zen} ｜ ST:{l.avgST}
            </div>
          )}
        </div>
      ))}

      <hr />
      <h4>入着率（仮表示）</h4>
      <p style={{ fontSize: 12 }}>
        ※ 次フェーズで場特性 × 選手能力から算出
      </p>
    </div>
  );
}