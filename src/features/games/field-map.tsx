import type { Mission } from "./content";

interface FieldMapProps { mission?: Mission; recorded?: number; onRecord?: (index: number) => void; }

export default function FieldMap({ mission, recorded = 0, onRecord }: FieldMapProps) {
  const points = mission?.points ?? [];
  const visible = points.filter((point, index) => point.id !== "a-return" && !(point.id === "a" && recorded >= 4 && points.length === 5));
  if (mission?.id === "city-grid" && recorded >= 4) visible.push(points[4]);
  return (
    <div className={`quest-map ${mission?.id ?? "overworld"}`}>
      <svg viewBox="0 0 800 480" preserveAspectRatio="none" aria-hidden="true" className="quest-terrain">
        <defs><pattern id="quest-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#64cba1" strokeOpacity=".12" /></pattern></defs>
        <rect width="800" height="480" fill="#082f29" /><rect width="800" height="480" fill="url(#quest-grid)" />
        <path d="M0 360 Q200 260 380 355 T800 275 V480 H0Z" fill="#083e4c" />
        {[0, 1, 2, 3].map(i => <path key={i} d={`M0 ${390 + i * 24} Q200 ${285 + i * 24} 380 ${375 + i * 24} T800 ${305 + i * 24}`} fill="none" stroke="#53bfd0" strokeOpacity=".2" />)}
        {[45, 70, 100, 138, 185, 235].map(r => <ellipse key={r} cx="630" cy="130" rx={r} ry={r * .65} fill="none" stroke="#c9a878" strokeOpacity=".35" />)}
        {[0, 1, 2, 3].map(i => <g key={i} fill="#205044" stroke="#588473" strokeOpacity=".35"><rect x={70 + i * 66} y="80" width="42" height="50" /><rect x={70 + i * 66} y="165" width="42" height="65" /></g>)}
        {!mission && <path d="M180 180L430 350L640 115" stroke="#73dbb0" strokeWidth="2" strokeDasharray="7 8" fill="none" />}
      </svg>
      <span className="quest-north" aria-hidden="true">↑<br />N</span>
      {mission ? <>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="quest-terrain" aria-hidden="true">
          <polyline points={points.slice(0, recorded).map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#67e8f9" strokeWidth=".5" strokeDasharray="1 1" />
        </svg>
        {visible.map(point => {
          const index = points.indexOf(point);
          return <button key={point.id} className={`quest-point ${index < recorded ? "is-recorded" : ""}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} onClick={() => onRecord?.(index)} disabled={index < recorded} aria-label={`Record ${point.label}`}>
            <span>{index < recorded ? "✓" : point.id === "a-return" ? "A" : point.id.toUpperCase()}</span><small>{point.label}</small>
          </button>;
        })}
      </> : <><span className="quest-region city">01 / CITY GRID</span><span className="quest-region bay">02 / COASTAL BAY</span><span className="quest-region mountain">03 / MOUNTAIN PASS</span></>}
      <span className="quest-map-caption">{mission ? "TRAINING FIELD · SCHEMATIC, NOT TO SCALE" : "GESS FIELD ATLAS / THREE PLACES TO BEGIN"}</span>
    </div>
  );
}
