import "./style.css";
import "./mobile.css";
import "./gess-green-theme.css";
import {
  concepts,
  extendedConcepts,
  extendedQuestions,
  lessonCategories,
  masteryConcepts,
  masteryQuestions,
  modules,
  pdfCoverage,
  questions,
  supplementalConcepts,
  supplementalQuestions,
  type Concept,
  type Question,
} from "./data";
import { pdfSourcePages } from "./pdf-source";
import {
  lesson2Concepts,
  lesson2Questions,
  lesson2SourcePages,
} from "./lesson2";
import {
  lesson1Concepts,
  lesson1Questions,
  lesson1SourcePages,
} from "./lesson1";
import {
  lesson3Concepts,
  lesson3Questions,
  lesson3SourcePages,
} from "./lesson3";
import {
  lesson5Concepts,
  lesson5Questions,
  lesson5SourcePages,
} from "./lesson5";
import {
  lesson6Concepts,
  lesson6Questions,
  lesson6SourcePages,
} from "./lesson6";
import {
  lesson7Concepts,
  lesson7Questions,
  lesson7SourcePages,
} from "./lesson7";
import {
  lesson8Concepts,
  lesson8Questions,
  lesson8SourcePages,
} from "./lesson8";
import {
  lesson1ChallengeExpansion,
  lesson2ChallengeExpansion,
  lesson3ChallengeExpansion,
  lesson3ConceptExpansion,
  lesson4ChallengeExpansion,
} from "./challenge-expansion";
type State = {
  xp: number;
  streak: number;
  mastered: Record<string, number>;
  due: Record<string, number>;
  history: string[];
  errors: string[];
};
const key = "remote-sensing-quest-device-progress-v2";
const blankState = (): State => ({
  xp: 0,
  streak: 1,
  mastered: {},
  due: {},
  history: [],
  errors: [],
});
const loadState = (): State => {
  try {
    const saved =
      localStorage.getItem(key) ??
      localStorage.getItem("remote-sensing-quest-v1");
    return saved ? { ...blankState(), ...JSON.parse(saved) } : blankState();
  } catch {
    return blankState();
  }
};
const state: State = loadState();
const save = () => localStorage.setItem(key, JSON.stringify(state));
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (x) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[x]!,
  );
const moduleFor = (name: string) => modules.find((m) => m.name === name)!;
const mastery = (c: Concept) => state.mastered[c.id] || 0;
const level = () => Math.floor(state.xp / 150) + 1;
const lesson4Concepts = [
  ...concepts,
  ...extendedConcepts,
  ...supplementalConcepts,
  ...masteryConcepts,
];
const lesson4Questions = [
  ...questions,
  ...extendedQuestions,
  ...supplementalQuestions,
  ...masteryQuestions,
  ...lesson4ChallengeExpansion,
];
type LessonId =
  | "lesson-1"
  | "lesson-2"
  | "lesson-3"
  | "lesson-4"
  | "lesson-5"
  | "lesson-6"
  | "lesson-7"
  | "lesson-8";
type LessonContent = {
  concepts: Concept[];
  questions: Question[];
  sourcePages:
    | typeof lesson1SourcePages
    | typeof lesson2SourcePages
    | typeof lesson3SourcePages
    | typeof pdfSourcePages
    | typeof lesson5SourcePages
    | typeof lesson6SourcePages
    | typeof lesson7SourcePages
    | typeof lesson8SourcePages;
};
const lessonContent: Record<LessonId, LessonContent> = {
  "lesson-1": {
    concepts: lesson1Concepts,
    questions: [...lesson1Questions, ...lesson1ChallengeExpansion],
    sourcePages: lesson1SourcePages,
  },
  "lesson-2": {
    concepts: lesson2Concepts,
    questions: [...lesson2Questions, ...lesson2ChallengeExpansion],
    sourcePages: lesson2SourcePages,
  },
  "lesson-3": {
    concepts: [...lesson3Concepts, ...lesson3ConceptExpansion],
    questions: [...lesson3Questions, ...lesson3ChallengeExpansion],
    sourcePages: lesson3SourcePages,
  },
  "lesson-4": {
    concepts: lesson4Concepts,
    questions: lesson4Questions,
    sourcePages: pdfSourcePages,
  },
  "lesson-5": {
    concepts: lesson5Concepts,
    questions: lesson5Questions,
    sourcePages: lesson5SourcePages,
  },
  "lesson-6": {
    concepts: lesson6Concepts,
    questions: lesson6Questions,
    sourcePages: lesson6SourcePages,
  },
  "lesson-7": {
    concepts: lesson7Concepts,
    questions: lesson7Questions,
    sourcePages: lesson7SourcePages,
  },
  "lesson-8": {
    concepts: lesson8Concepts,
    questions: lesson8Questions,
    sourcePages: lesson8SourcePages,
  },
};
const lessonLabel: Record<LessonId, string> = {
  "lesson-1": "Lesson 1",
  "lesson-2": "Lesson 2",
  "lesson-3": "Lesson 3",
  "lesson-4": "Lesson 4",
  "lesson-5": "Lesson 5",
  "lesson-6": "Lesson 6",
  "lesson-7": "Lesson 7",
  "lesson-8": "Lesson 8",
};
let view: "home" | "learn" | "cover" | "flash" | "quiz" | "library" | "source" =
  "home";
let activeLessonId: LessonId | null = null;
let active = 0;
let quizIndex = 0;
let score = 0;
let mode = "mixed";
let revealed = false;
const activeLesson = () => lessonContent[activeLessonId ?? "lesson-1"];
const activeLessonLabel = () => lessonLabel[activeLessonId ?? "lesson-1"];
function activeSourcePages() {
  if (activeLessonId === "lesson-4")
    return pdfSourcePages.map((page) => ({
      ...page,
      lesson: "Lesson 4",
      module: pdfCoverage[page.page - 1].module,
    }));
  if (activeLessonId === "lesson-3")
    return lesson3SourcePages.map((page) => ({ ...page, lesson: "Lesson 3" }));
  if (activeLessonId === "lesson-2")
    return lesson2SourcePages.map((page) => ({ ...page, lesson: "Lesson 2" }));
  if (activeLessonId === "lesson-6")
    return lesson6SourcePages.map((page) => ({ ...page, lesson: "Lesson 6" }));
  if (activeLessonId === "lesson-8")
    return lesson8SourcePages.map((page) => ({ ...page, lesson: "Lesson 8" }));
  if (activeLessonId === "lesson-7")
    return lesson7SourcePages.map((page) => ({ ...page, lesson: "Lesson 7" }));
  if (activeLessonId === "lesson-5")
    return lesson5SourcePages.map((page) => ({ ...page, lesson: "Lesson 5" }));
  return lesson1SourcePages.map((page) => ({ ...page, lesson: "Lesson 1" }));
}
function nav() {
  if (!activeLessonId) return "";
  return `<aside><div class="brand">ORBIT<br><small>STUDY QUEST</small></div><div class="lesson-active">${activeLessonLabel()}<small>Active lesson</small></div>${[
    ["learn", "Learn"],
    ["cover", "Cover & Check"],
    ["flash", "Flashcards"],
    ["quiz", "Challenge"],
    ["library", "Study Library"],
    ["source", "Lesson Notes"],
  ]
    .map(
      ([id, label]) =>
        `<button class="nav ${view === id ? "active" : ""}" data-view="${id}">${label}</button>`,
    )
    .join(
      "",
    )}<div class="side-note"><button class="change-lesson" data-action="choose-lesson">Change lesson</button><b>Progress is saved on this device</b></div></aside>`;
}
function backButton() {
  return `<div class="page-actions"><button class="back-button" data-action="back">← Back to lessons</button><button class="switch-lesson" data-action="choose-lesson">Choose another lesson</button></div>`;
}
function progress(c: Concept) {
  return `<div class="dots">${[1, 2, 3, 4, 5].map((n) => `<i class="${mastery(c) >= n ? "on" : ""}"></i>`).join("")}</div>`;
}
function home() {
  const categoryCards = lessonCategories
    .map((category, index) => {
      const id = category.id as LessonId;
      const data = lessonContent[id];
      return `<button class="module lesson-category has-content" data-lesson="${id}"><span>LESSON ${index + 1}</span><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p><div class="bar"><i style="width:100%"></i></div><small>${data.concepts.length} concepts · ${data.questions.length} challenge questions · ${data.sourcePages.length} pages</small><strong>Open Lesson ${index + 1} →</strong></button>`;
    })
    .join("");
  return `<main class="lesson-dashboard"><header><div><p class="eyebrow">REMOTE SENSING · LESSON DASHBOARD</p><h1>Choose your lesson.</h1><p class="muted">Start by selecting one lesson. Every study tool you open afterward is locked to that lesson’s content.</p></div><div class="level">LVL ${level()}<span>${state.xp} XP on this device</span></div></header><section class="stats"><article><span>XP</span><b>${state.xp}</b><small>earned on this device</small></article><article><span>LESSONS</span><b>${lessonCategories.length}</b><small>separate study categories</small></article><article><span>QUESTIONS</span><b>${Object.values(lessonContent).reduce((total, lesson) => total + lesson.questions.length, 0)}</b><small>lesson-scoped challenges</small></article><article><span>PAGES</span><b>${Object.values(lessonContent).reduce((total, lesson) => total + lesson.sourcePages.length, 0)}</b><small>source slides represented</small></article></section><section class="hero"><div><p class="eyebrow">SELECT A LESSON TO BEGIN</p><h2>Your study workspace will open after you choose.</h2><p>Progress remains in this browser on this device. It is never shared to another device.</p></div><div class="planet"><small>LESSON SELECT</small></div></section><h2>Lesson categories</h2><div class="modules">${categoryCards}</div></main>`;
}
function emptyLesson(modeName: string) {
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()}</p><h1>${modeName}</h1><p class="muted">This lesson category has no content yet. Select another category from the dashboard.</p></div></header></main>`;
}
function learn() {
  const concepts = activeLesson().concepts;
  if (!concepts.length) return emptyLesson("Learn");
  const c = concepts[active % concepts.length];
  return `<main>${backButton()}<header class="learn-context"><p class="eyebrow">${activeLessonLabel().toUpperCase()} · LEARN · PAGE ${c.sourcePage}</p>${progress(c)}</header><section class="study-card"><header class="study-card-heading"><p class="study-card-topic">${esc(c.topic)}</p><h1>${esc(c.term)}</h1></header><p class="definition">${esc(c.definition)}</p><div class="fact-list">${c.facts.map((f) => `<p>✦ ${esc(f)}</p>`).join("")}</div><footer><span>Source: page ${c.sourcePage}</span><div><button class="ghost" data-action="prev">← Previous</button><button data-action="next">Next concept →</button></div></footer></section><section class="lesson-topics"><h2>More in this lesson</h2><div class="mobile-topic-picker"><label for="topic-select">Jump to another topic</label><select id="topic-select">${concepts.map((x) => `<option value="${x.id}" ${x.id === c.id ? "selected" : ""}>${esc(x.term)}</option>`).join("")}</select></div><div class="chips">${concepts.map((x) => `<button data-concept="${x.id}">${esc(x.term)}</button>`).join("")}</div></section></main>`;
}
function cover() {
  const cards = activeLesson().concepts;
  if (!cards.length) return emptyLesson("Cover & Check");
  const c = cards[active % cards.length];
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()} · COVER & CHECK · PAGE ${c.sourcePage}</p><h1>Recall before you reveal.</h1></div>${progress(c)}</header><section class="cover-card"><p>${esc(c.definition)}</p>${revealed ? `<div class="answer">${esc(c.term)}<small>${c.facts[0] ? esc(c.facts[0]) : "Source-grounded concept"}</small></div><h3>Did you remember it?</h3><div class="rating"><button data-rate="1">Again</button><button data-rate="3">Almost</button><button data-rate="5">Yes — easy</button></div>` : `<button class="reveal" data-action="reveal">Reveal answer</button>`}<small>Source: page ${c.sourcePage}</small></section></main>`;
}
function flash() {
  const cards = activeLesson().concepts;
  if (!cards.length) return emptyLesson("Flashcards");
  const c = cards[active % cards.length];
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()} · SPACED REPETITION</p><h1>Flashcards</h1></div><span class="badge">${cards.filter((card) => (state.due[card.id] || 0) <= Date.now()).length} due</span></header><section class="flash"><button class="card-face ${revealed ? "back" : ""}" data-flashcard aria-label="Flip flashcard. You can also press Space or Enter."><small>${revealed ? "ANSWER" : "TERM"}</small><h2>${esc(revealed ? c.definition : c.term)}</h2>${revealed ? `<p>${c.facts.map(esc).join(" · ")}</p><em>Page ${c.sourcePage}</em>` : `<em>Tap the card, or press Space / Enter to flip</em>`}</button>${revealed ? `<div class="rating"><button data-rate="1">Again</button><button data-rate="2">Hard</button><button data-rate="4">Good</button><button data-rate="5">Easy</button></div>` : `<button class="reveal" data-action="reveal">Flip card</button>`}</section></main>`;
}
function questionSet() {
  const questions = activeLesson().questions;
  if (mode === "mixed")
    return questions.filter((q) => q.type !== "boss").slice(0, 40);
  if (mode === "boss") {
    const bosses = questions.filter((q) => q.type === "boss");
    return bosses.length ? bosses : questions.slice(0, 40);
  }
  const filtered = questions.filter((q) => q.type === mode);
  return filtered.length
    ? filtered.sort(
        (left, right) =>
          Number(Boolean(right.visualFill)) - Number(Boolean(left.visualFill)),
      )
    : questions.filter((q) => q.type !== "boss").slice(0, 40);
}
function visualFillQuestion(q: Question) {
  const visual = q.visualFill!;
  return `<div class="visual-fill"><div class="visual-fill-heading"><span>VISUAL IDENTIFICATION ROUND</span><b>+5 XP per correct label</b></div><img src="${esc(visual.image)}" alt="${esc(visual.alt)}" class="visual-fill-image"/><form id="visual-fill-form" class="visual-fill-form">${visual.prompts.map((prompt, index) => `<label><span>${index + 1}. ${esc(prompt.label)}</span><input name="visual-${index}" placeholder="Type your answer" autocomplete="off" required/><small>${esc(prompt.hint)}</small></label>`).join("")}<button>Check visual answers</button></form></div>`;
}
function quiz() {
  const qs = questionSet();
  if (!qs.length) return emptyLesson("Challenge");
  const q = qs[quizIndex % qs.length];
  const boss = mode === "boss";
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()} · ${boss ? "BOSS BATTLE" : "CHALLENGE"} · ${q.difficulty.toUpperCase()}</p><h1>${boss ? "SENSOR COMMANDER" : "Test your signal"}</h1><p class="muted">Question ${(quizIndex % qs.length) + 1} of ${qs.length} · Score ${score}</p></div>${boss ? `<div class="health"><span style="width:${Math.max(0, 100 - score * 5)}%"></span></div>` : ""}</header><div class="mode-row">${[
    ["mixed", "All 40"],
    ["mcq", "Multiple choice"],
    ["identify", "Identification"],
    ["tf", "True / false"],
    ["number", "Numbers"],
    ["classify", "Classification"],
    ["boss", "Boss battle"],
  ]
    .map(
      ([id, l]) =>
        `<button class="${mode === id ? "selected" : ""}" data-mode="${id}">${l}</button>`,
    )
    .join(
      "",
    )}</div><section class="quiz-card ${q.visualFill ? "visual-quiz-card" : ""}"><small>PAGE ${q.sourcePage} · ${esc(q.module)}</small><h2>${esc(q.question)}</h2>${q.visualFill ? visualFillQuestion(q) : q.choices ? `<div class="choices">${q.choices.map((x) => `<button data-answer="${esc(x)}">${esc(x)}</button>`).join("")}</div>` : q.type === "tf" ? `<div class="choices"><button data-answer="true">True</button><button data-answer="false">False</button></div>` : `<form id="answer-form"><input autofocus placeholder="Type your answer"/><button>Check answer</button></form>`}<div id="feedback"></div></section></main>`;
}
function library() {
  const concepts = activeLesson().concepts;
  if (!concepts.length) return emptyLesson("Study library");
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()} · SEARCHABLE STUDY ENCYCLOPEDIA</p><h1>Study library</h1><p class="muted">Every entry belongs only to the selected lesson.</p></div></header><input id="search" class="search" placeholder="Search this lesson…"/><div id="library-list" class="library">${conceptList(concepts)}</div></main>`;
}
function conceptList(list: Concept[]) {
  return (
    list
      .map(
        (c) =>
          `<article><small>${esc(c.module)} · PDF ${c.sourcePage}</small><h3>${esc(c.term)}</h3><p>${esc(c.definition)}</p>${progress(c)}</article>`,
      )
      .join("") || "<p>No matching concepts.</p>"
  );
}
function source() {
  const items = activeSourcePages();
  if (!items.length) return emptyLesson("Lesson notes");
  return `<main>${backButton()}<header><div><p class="eyebrow">${activeLessonLabel().toUpperCase()} · LESSON REFERENCE</p><h1>Source lesson pages</h1><p class="muted">Search terms, values, diagrams, and tables from this lesson only.</p></div></header><input id="source-search" class="search" placeholder="Search this lesson…"/><div id="source-list" class="source-list">${sourceList(items)}</div></main>`;
}
function sourceList(
  items: Array<{
    page: number;
    module: string;
    extractedText: string;
    visualDescription: string;
    lesson: string;
  }>,
) {
  return (
    items
      .map(
        (p) =>
          `<article><header><b>${esc(p.lesson)} · PAGE ${p.page}</b><span>${esc(p.module)}</span></header><pre>${esc(p.extractedText || "This page is represented by a diagram, figure, or table.")}</pre></article>`,
      )
      .join("") || "<p>No matching lesson page.</p>"
  );
}
function render() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML =
    nav() +
    (view === "home"
      ? home()
      : view === "learn"
        ? learn()
        : view === "cover"
          ? cover()
          : view === "flash"
            ? flash()
            : view === "quiz"
              ? quiz()
              : view === "library"
                ? library()
                : source());
  window.scrollTo(0, 0);
  bind();
  bindFlashFlip();
}
function bindFlashFlip() {
  document.querySelector("[data-flashcard]")?.addEventListener("click", () => {
    revealed = !revealed;
    render();
  });
  document.onkeydown = (event) => {
    if (view !== "flash" || (event.key !== " " && event.key !== "Enter"))
      return;
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "BUTTON") return;
    event.preventDefault();
    revealed = !revealed;
    render();
  };
}
function advance() {
  const cards = activeLesson().concepts;
  if (!cards.length) return;
  active = (active + 1) % cards.length;
  revealed = false;
  render();
}
function rate(n: number) {
  const cards = activeLesson().concepts;
  if (!cards.length) return;
  const c = cards[active % cards.length];
  state.mastered[c.id] = Math.max(
    0,
    Math.min(5, (state.mastered[c.id] || 0) + (n >= 4 ? 1 : n === 1 ? -1 : 0)),
  );
  state.xp += n >= 4 ? 15 : 5;
  state.due[c.id] = Date.now() + ([0, 1, 3, 7, 14, 30][n] || 1) * 86400000;
  save();
  advance();
}
function answerVisual() {
  const qs = questionSet();
  const q = qs[quizIndex % qs.length];
  const visual = q.visualFill;
  if (!visual) return;
  const clean = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const results = visual.prompts.map((prompt, index) => {
    const input = document.querySelector<HTMLInputElement>(
      `[name="visual-${index}"]`,
    )!;
    const correct = clean(input.value) === clean(prompt.answer);
    input.disabled = true;
    input.classList.add(correct ? "correct" : "incorrect");
    return { prompt, correct };
  });
  document.querySelector<HTMLButtonElement>(
    "#visual-fill-form button",
  )!.disabled = true;
  const correctCount = results.filter((result) => result.correct).length;
  const gained = correctCount * 5;
  const feedback = document.querySelector("#feedback")!;
  feedback.innerHTML = `<div class="feedback ${correctCount === results.length ? "ok" : "no"}"><b>${correctCount === results.length ? `Perfect visual read! +${gained} XP` : `${correctCount}/${results.length} labels correct · +${gained} XP`}</b><div class="visual-results">${results.map((result) => `<p>${result.correct ? "Correct" : "Review"}: <b>${esc(result.prompt.label)}</b> — ${esc(result.prompt.answer)}</p>`).join("")}</div><p>${esc(q.explanation)} Source: PDF page ${q.sourcePage}.</p><button data-action="next-q">Next question →</button></div>`;
  score += correctCount;
  state.xp += gained;
  state.history.push(q.id);
  if (correctCount !== results.length) state.errors.push(q.id);
  save();
  feedback
    .querySelector<HTMLButtonElement>("[data-action='next-q']")
    ?.addEventListener("click", () => {
      quizIndex++;
      render();
    });
}
function answer(value: string) {
  const qs = questionSet();
  const q = qs[quizIndex % qs.length];
  const clean = (x: string) =>
    x
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const ok =
    clean(value) === clean(q.answer) ||
    (clean(q.answer).includes(clean(value)) && clean(value).length > 2);
  const feedback = document.querySelector("#feedback")!;
  feedback.innerHTML = `<div class="feedback ${ok ? "ok" : "no"}"><b>${ok ? "Correct! +15 XP" : "Not quite."}</b><p>${esc(q.explanation)} Source: PDF page ${q.sourcePage}.</p><button data-action="next-q">Next question →</button></div>`;
  if (ok) {
    score++;
    state.xp += 15;
  } else state.errors.push(q.id);
  state.history.push(q.id);
  save();
  document
    .querySelectorAll("[data-answer]")
    .forEach((b) => ((b as HTMLButtonElement).disabled = true));
  feedback
    .querySelector<HTMLButtonElement>("[data-action='next-q']")
    ?.addEventListener("click", () => {
      quizIndex++;
      render();
    });
}
function bind() {
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      view = (b as HTMLElement).dataset.view as typeof view;
      revealed = false;
      render();
    }),
  );
  document.querySelectorAll("[data-lesson]").forEach((b) =>
    b.addEventListener("click", () => {
      activeLessonId = (b as HTMLElement).dataset.lesson as LessonId;
      active = 0;
      quizIndex = 0;
      score = 0;
      mode = "mixed";
      revealed = false;
      view = "learn";
      render();
    }),
  );
  document.querySelectorAll("[data-action]").forEach((b) =>
    b.addEventListener("click", () => {
      const a = (b as HTMLElement).dataset.action;
      const cards = activeLesson().concepts;
      if (a === "next" || a === "start-cover") {
        if (a === "start-cover") view = "cover";
        else if (cards.length) active = (active + 1) % cards.length;
        revealed = false;
        render();
      }
      if (a === "prev" && cards.length) {
        active = (active - 1 + cards.length) % cards.length;
        render();
      }
      if (a === "reveal") {
        revealed = true;
        render();
      }
      if (a === "next-q") {
        quizIndex++;
        render();
      }
      if (a === "back" || a === "choose-lesson") {
        activeLessonId = null;
        view = "home";
        revealed = false;
        render();
      }
    }),
  );
  document
    .querySelectorAll("[data-rate]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        rate(Number((b as HTMLElement).dataset.rate)),
      ),
    );
  document.querySelectorAll("[data-concept]").forEach((b) =>
    b.addEventListener("click", () => {
      active = activeLesson().concepts.findIndex(
        (c) => c.id === (b as HTMLElement).dataset.concept,
      );
      render();
    }),
  );
  document
    .querySelector<HTMLSelectElement>("#topic-select")
    ?.addEventListener("change", (event) => {
      const select = event.currentTarget as HTMLSelectElement;
      active = activeLesson().concepts.findIndex(
        (c) => c.id === select.value,
      );
      render();
    });
  document.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      mode = (b as HTMLElement).dataset.mode!;
      quizIndex = 0;
      score = 0;
      render();
    }),
  );
  document
    .querySelectorAll("[data-answer]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        answer((b as HTMLElement).dataset.answer!),
      ),
    );
  document.querySelector("#answer-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    answer(
      document.querySelector<HTMLInputElement>("#answer-form input")!.value,
    );
  });
  document
    .querySelector("#visual-fill-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      answerVisual();
    });
  document.querySelector("#search")?.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    document.querySelector("#library-list")!.innerHTML = conceptList(
      activeLesson().concepts.filter((c) =>
        `${c.term} ${c.definition} ${c.module} ${c.facts.join(" ")}`
          .toLowerCase()
          .includes(value),
      ),
    );
  });
  document.querySelector("#source-search")?.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    document.querySelector("#source-list")!.innerHTML = sourceList(
      activeSourcePages().filter((p) =>
        `${p.lesson} ${p.page} ${p.extractedText} ${p.visualDescription}`
          .toLowerCase()
          .includes(value),
      ),
    );
  });
}
render();
