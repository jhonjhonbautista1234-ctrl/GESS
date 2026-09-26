"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, LockKeyhole, MapPin, Trophy } from "lucide-react";
import { missions, readProgress, storageKey, type Mission } from "./content";
import FieldMap from "./field-map";
import MissionPlay from "./mission-play";

export default function SurveyQuest() {
  const [active, setActive] = useState<Mission | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const destination = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setCompleted(readProgress(localStorage.getItem(storageKey))); }
    catch { setStorageAvailable(false); }
    setReady(true);
  }, []);

  function save(next: string[]) {
    setCompleted(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setStorageAvailable(false); }
  }
  function complete(id: string) {
    if (!completed.includes(id)) save([...completed, id]);
  }
  function changeMission(mission: Mission | null) {
    setActive(mission);
    setConfirmReset(false);
    requestAnimationFrame(() => {
      destination.current?.focus({ preventScroll: true });
      destination.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  return <main className="quest">
    <div className="quest-shell">
      <div className="quest-intro"><div><p className="quest-kicker"><Compass size={16} aria-hidden="true" /> THE FIELD IS YOUR CLASSROOM</p><h1>Small missions.<br /><span>Real discoveries.</span></h1><p>Welcome to <strong>GESS Survey Quest.</strong> Learn to measure, map, and understand the world—one field mission at a time.</p><div className="quest-tags"><span>No experience needed</span><span>3 short missions</span><span>Free to explore</span></div></div>
        <aside className="quest-profile" aria-label="Your learning progress"><Trophy size={25} aria-hidden="true" /><p className="quest-kicker">YOUR FIELD RECORD</p><h2>{completed.length === 3 ? "Survey Explorer" : "Cadet Surveyor"}</h2><div className="quest-xp"><strong>{completed.length * 100}</strong><span> / 300 XP</span></div><progress value={completed.length} max={3} aria-label="Completed missions" /><p>{completed.length} of 3 missions complete</p><small>{storageAvailable ? "Completed missions saved on this device." : "Device storage unavailable. Progress lasts for this visit."}</small></aside>
      </div>
      <div ref={destination} tabIndex={-1} className="quest-destination">
        {active ? <MissionPlay key={active.id} mission={active} onExit={() => changeMission(null)} onComplete={complete} /> : <>
          <div className="quest-section-heading"><div><p className="quest-kicker">CHOOSE YOUR NEXT COORDINATE</p><h2>Your adventure starts here.</h2></div><span className="quest-small">Learn → explore → put it into practice</span></div>
          <div className="quest-atlas"><FieldMap /><div className="quest-atlas-note"><MapPin size={18} aria-hidden="true" /><span>Three landscapes.<br /><strong>A new way to see the world.</strong></span></div></div>
          <div className="quest-missions">{missions.map((mission, index) => {
            const done = completed.includes(mission.id);
            const locked = index > 0 && !completed.includes(missions[index - 1].id);
            return <article key={mission.id} className={`quest-panel quest-mission ${locked ? "is-locked" : ""}`}><div className="quest-card-top"><span className="quest-number">0{index + 1}</span><span className="quest-badge">{done ? "✓ Completed" : locked ? "Locked" : "Ready to explore"}</span></div><p className="quest-kicker">{mission.concept}</p><h3>{mission.name}</h3><p>{mission.description}</p><div className="quest-card-bottom"><span>~3 MIN · 100 XP</span><button disabled={!ready || locked} className="quest-primary" onClick={() => changeMission(mission)} aria-label={`${done ? "Replay" : "Start"} ${mission.name}`}>{locked ? <><LockKeyhole size={14} aria-hidden="true" /> Locked</> : done ? "Replay ↗" : "Start mission ↗"}</button></div>{locked && <small>Complete {missions[index - 1].name} to unlock.</small>}</article>;
          })}</div>
          {completed.length === 3 && <div className="quest-celebration" role="status"><Trophy aria-hidden="true" /><div><h2>Every great survey starts with curiosity.</h2><p>All three missions complete. You’ve earned the Survey Explorer badge!</p></div></div>}
        </>}
      </div>
      <footer className="quest-footnote"><div><strong>A little practice. A different perspective.</strong><p>Simplified learning exercises with simulated data. Explore more with <a href="https://oceanservice.noaa.gov/navigation/hydro/" target="_blank" rel="noreferrer">NOAA’s hydrography guide</a> and <a href="https://pubs.usgs.gov/publication/fs07999" target="_blank" rel="noreferrer">USGS’s map guide</a>.</p></div>{ready && completed.length > 0 && <div>{confirmReset ? <div className="quest-reset"><span>Clear your saved progress?</span><button onClick={() => { save([]); setActive(null); setConfirmReset(false); }} className="quest-text-button">Yes, reset</button><button onClick={() => setConfirmReset(false)} className="quest-text-button">Cancel</button></div> : <button className="quest-text-button" onClick={() => setConfirmReset(true)}>Reset progress</button>}</div>}</footer>
    </div>
  </main>;
}
