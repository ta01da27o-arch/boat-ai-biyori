import { useState } from "react";
import { players } from "../data/players";

export default function Predictor({ stadium, onBack }) {
  const [lanes, setLanes] = useState(Array(6).fill({ number: "" }));

  const update = (i, number) => {
    const p = players[number];
    const copy = [...lanes];
    copy[i] = { number, ...p };
    setLanes(copy);
  };

  return (
    <div>
      <button onClick={onBack}>← 場選択へ</button>
      <h3>{stadium.name}（{stadium.feature}）</h3>

      {lanes.map((l, i) => (
        <div key={i} style={{ border: "1px solid #ccc", marginBottom: 4, padding: 4 }}>
          <b>{i + 1}コース</b>
          <input
            placeholder="選手番号"
            value={l.number}
            onChange={e => update(i, e.target.value)}
          />
          {l.name && (
            <div>
              {l.name} / {l.grade} / 全:{l.zen} / ST:{l.avgST}
            </div>
          )}
        </div>
      ))}

      <hr />
      <h4>入着率（仮）</h4>
      <p>※ 次フェーズで算出ロジック実装</p>
    </div>
  );
}