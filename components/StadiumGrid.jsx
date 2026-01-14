import { stadiums } from "../data/stadiums";

export default function StadiumGrid({ onSelect }) {
  return (
    <div>
      <h2>開催場選択</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {stadiums.map(s => (
          <button key={s.id} onClick={() => onSelect(s)}>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
