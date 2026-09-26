"use client";

import { useRef, useState } from "react";
import type { Mission } from "./content";
import FieldMap from "./field-map";

interface MissionPlayProps { mission: Mission; onExit: () => void; onComplete: (id: string) => void; }

export default function MissionPlay({ mission, onExit, onComplete }: MissionPlayProps) {
  const [recorded, setRecorded] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const question = mission.questions[questionIndex];
  const correct = selected === question.answer;
  const fieldDone = recorded === mission.points.length;
  const progress = finished ? 100 : Math.round((recorded + questionIndex) / (mission.points.length + mission.questions.length) * 100);

  function record(index: number) {
    if (index !== recorded) { setFeedback("Follow the route in order. Select the next unrecorded marker."); return; }
    setRecorded(count => count + 1);
    setFeedback(`${mission.points[index].label} recorded.${index === mission.points.length - 1 ? " Fieldwork complete. Try the knowledge check below." : " Continue to the next marker."}`);
  }

  function advance() {
    if (!correct) return;
    if (questionIndex === mission.questions.length - 1) {
      onComplete(mission.id); setFinished(true);
    } else { setQuestionIndex(index => index + 1); setSelected(null); }
    heading.current?.focus();
  }

  return <section className="quest-panel quest-play" aria-label={mission.name}>
    <div className="quest-play-heading"><button className="quest-text-button" onClick={onExit}>← Mission map</button><span className="quest-kicker">{mission.concept}</span></div>
    <div className="quest-play-layout">
      <div><FieldMap mission={mission} recorded={recorded} onRecord={record} /><p className="quest-feedback" role="status">{feedback || "Select a marker to begin. You can also use Tab and Enter."}</p></div>
      <div className="quest-brief">
        <p className="quest-kicker">Field notebook / {mission.tool}</p><h2>{mission.name}</h2>
        <p>{mission.note}</p>
        <div className="quest-task"><strong>Your field task</strong><p>{mission.task}</p></div>
        <div className="quest-progress-label"><span>Mission progress</span><span>{progress}%</span></div>
        <progress value={progress} max={100} aria-label="Mission progress" />
        <p className="quest-small">{recorded} / {mission.points.length} observations recorded · {finished ? 2 : questionIndex} / 2 concepts checked</p>
      </div>
    </div>
    <div className="quest-check">
      <h3 tabIndex={-1} ref={heading}>{finished ? "Mission accomplished." : "Put your field notes to work."}</h3>
      {finished ? <><p>You earned this mission’s 100 XP. Replays are always open for practice.</p><button className="quest-primary" onClick={onExit}>Continue to mission map →</button></> : !fieldDone ? <p>Record all the field markers above to unlock your two-question knowledge check.</p> : <>
        <p className="quest-kicker">Knowledge check {questionIndex + 1} / {mission.questions.length}</p>
        <fieldset><legend>{question.prompt}</legend><div className="quest-answers">{question.choices.map((choice, index) => <button key={`${questionIndex}-${index}`} aria-pressed={selected === index} disabled={correct} className={`quest-answer ${selected === index ? correct ? "correct" : "incorrect" : ""}`} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div></fieldset>
        <div role="status" className="quest-explanation">{selected !== null && <><strong>{correct ? "Well surveyed! " : "Try again. "}</strong>{correct ? question.explanation : "Check the field notebook and try another answer. There is no penalty for learning."}</>}</div>
        {correct && <button className="quest-primary" onClick={advance}>{questionIndex === mission.questions.length - 1 ? "Complete mission +100 XP" : "Next question →"}</button>}
      </>}
    </div>
  </section>;
}
