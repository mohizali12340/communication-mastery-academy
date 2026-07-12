import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Flame, Trophy, BookOpen, Mic, CheckCircle2, Circle, Lock,
  ChevronRight, ChevronLeft, Home, LayoutGrid, User, Award,
  Sparkles, Target, Clock, BarChart3, Quote, X, Menu, Sun, Moon,
  Star, MessageCircle, Volume2, PenLine, HelpCircle, ArrowRight
} from "lucide-react";
import { storage } from "./storage";

/* ============================== CONTENT DATA ============================== */

const MODULES = [
  {
    id: 1, key: "foundations", title: "Communication Foundations", range: [1, 15],
    blurb: "The physical and mental basics every confident communicator stands on.",
    topics: [
      "Building Real Confidence", "Reading Body Language", "Owning Your Body Language",
      "Mastering Eye Contact", "Voice Control Basics", "Breathing for Calm Speech",
      "Posture and Presence", "The Power of a Genuine Smile", "Speaking Clearly and Slowly",
      "Thinking Before You Speak", "Active Listening Fundamentals", "Listening Beyond the Words",
      "Removing Filler Words", "The Confident Mindset", "Module Review: Your Foundation"
    ]
  },
  {
    id: 2, key: "everyday", title: "Everyday Communication", range: [16, 30],
    blurb: "Turning small talk into real connection, in any room you walk into.",
    topics: [
      "The Art of Small Talk", "Meeting Strangers with Ease", "Making Friends as an Adult",
      "Building Real Rapport", "Using Humor Naturally", "Leading with Empathy",
      "Telling a Story People Remember", "Asking Questions That Open Doors",
      "Keeping a Conversation Alive", "Ending Conversations Gracefully", "Reading the Room",
      "Navigating Awkward Silences", "Group Conversations 101", "Texting and Digital Tone",
      "Module Review: Everyday Connection"
    ]
  },
  {
    id: 3, key: "professional", title: "Professional Communication", range: [31, 45],
    blurb: "The vocabulary, etiquette, and instincts of the workplace.",
    topics: [
      "Office Communication Basics", "Professional Etiquette", "Speaking Up in Meetings",
      "Running a Meeting", "Writing Emails That Get Read", "Communicating Like a Leader",
      "Handling Conflict at Work", "Giving Difficult Feedback", "Receiving Feedback Gracefully",
      "Networking with Purpose", "The Elevator Pitch", "Presenting to Your Team",
      "Professional Vocabulary Upgrade", "Cross-Department Communication",
      "Module Review: Workplace Presence"
    ]
  },
  {
    id: 4, key: "interview", title: "Interview Mastery", range: [46, 60],
    blurb: "Walking into any interview room and owning the conversation.",
    topics: [
      "Tell Me About Yourself", "The STAR Method", "Behavioral Interview Questions",
      "Answering \u201cWhy This Company?\u201d", "Salary Negotiation Basics",
      "Advanced Salary Negotiation", "Acing the Virtual Interview", "The HR Screening Call",
      "Technical Interview Communication", "Questions to Ask Your Interviewer",
      "Common Interview Mistakes", "Handling Curveball Questions", "Interview Body Language",
      "Following Up After an Interview", "Module Review: Interview Ready"
    ]
  },
  {
    id: 5, key: "publicspeaking", title: "Public Speaking", range: [61, 75],
    blurb: "From shaky notes to commanding a room without them.",
    topics: [
      "Structuring a Speech", "Opening Lines That Hook", "Closing Lines That Land",
      "Designing a Presentation", "Engaging Your Audience", "Voice Projection",
      "Storytelling on Stage", "The Art of Persuasion", "Overcoming Stage Fright",
      "Handling Q&A with Confidence", "Speaking Without Notes", "Using Pauses for Impact",
      "TED-Style Speaking", "Speaking to a Large Audience", "Module Review: Command the Room"
    ]
  },
  {
    id: 6, key: "advanced", title: "Advanced Communication", range: [76, 90],
    blurb: "Negotiation, influence, and executive presence for the long game.",
    topics: [
      "Principled Negotiation", "Advanced Negotiation Tactics", "Communicating as a Leader",
      "Building Executive Presence", "The Psychology of Persuasion", "Growing Your Influence",
      "Emotional Intelligence in Conversation", "Navigating Difficult Conversations",
      "De-escalating Tension", "Cross-Cultural Communication", "Debating with Respect",
      "Professional Public Speaking", "Communicating Change", "Your Personal Communication Style",
      "Graduation: Communication Mastery"
    ]
  }
];

const QUOTES = [
  "Communication works for those who work at it. \u2014 John Powell",
  "The single biggest problem in communication is the illusion that it has taken place. \u2014 George Bernard Shaw",
  "To effectively communicate, we must realize we are all different. \u2014 Tony Robbins",
  "Speak clearly, if you speak at all; carve every word before you let it fall. \u2014 O.W. Holmes",
  "Confidence comes not from always being right, but from not fearing to be wrong.",
  "The art of communication is the language of leadership. \u2014 James Humes",
  "Listening is a magnetic and strange thing, a creative force. \u2014 Karl Menninger",
  "Say what you mean, mean what you say, but don't say it mean.",
  "Silence is one of the great arts of conversation. \u2014 Cicero",
  "Your voice is your instrument \u2014 learn to play it with intention."
];

const READING_TEMPLATES = [
  (t) => `Most people think ${t.toLowerCase()} is a personality trait \u2014 something you either have or don't. It isn't. It's a stack of small, learnable behaviors that compound. Today you'll break it into pieces small enough to practice in a single conversation.`,
  (t) => `Here's what changes once you understand ${t.toLowerCase()}: you stop reacting to conversations and start steering them. That shift is subtle from the outside, but it's the entire difference between someone who is heard and someone who is talked over.`,
  (t) => `${t} is one of those skills that feels awkward for exactly as long as you're thinking about it consciously. The goal of today's lesson isn't to make you perfect \u2014 it's to make the first rep less awkward than it would have been without any preparation at all.`,
];

const READING_TEMPLATES_2 = [
  (t) => `The biggest mistake people make with ${t.toLowerCase()} is trying to change everything at once. Pick one habit from today's lesson, run it in your very next real conversation, and let the rest follow later.`,
  (t) => `Notice how differently this lands depending on context \u2014 a boardroom, a first date, a phone call with a stranger. The mechanics of ${t.toLowerCase()} stay the same; what changes is how much of it you dial up or down.`,
  (t) => `Give yourself permission to feel a little clumsy today. Every communicator you admire was once visibly practicing this exact skill in front of someone.`,
];

const TIPS = [
  "Practice this alone first, out loud, before you try it on another person.",
  "Record yourself once this week. You will hear things you never noticed you were doing.",
  "Small, consistent reps beat one long practice session. Five minutes daily wins.",
  "Watch someone you admire and name, specifically, what they're doing differently.",
  "The fastest way to improve is to ask one trusted person for one honest observation.",
];

const MISTAKES = [
  "Trying to sound like someone else instead of a clearer version of yourself.",
  "Over-preparing the words and under-preparing the delivery.",
  "Avoiding the skill entirely because the first attempt felt clumsy.",
  "Focusing on what you'll say next instead of what's happening right now.",
];

function seedFrom(day) { return day * 2654435761 % 2147483647; }
function pick(arr, seed) { return arr[seed % arr.length]; }

function buildLesson(day, title, mod) {
  const seed = seedFrom(day);
  const isReview = title.startsWith("Module Review") || title.startsWith("Graduation");
  const difficulty = day <= 15 ? "Beginner" : day <= 45 ? "Intermediate" : day <= 75 ? "Advanced" : "Mastery";
  const est = 12 + (seed % 4) * 3;

  const objectives = isReview
    ? [
        `Revisit and reinforce every skill from ${mod.title}.`,
        "Identify your strongest and weakest habit from this module.",
        "Set one concrete goal to carry into the next module.",
      ]
    : [
        `Understand what ${title.toLowerCase()} actually means in practice, not just theory.`,
        "Learn one script and one exercise you can use today.",
        "Apply it once in a real conversation before tomorrow's lesson.",
      ];

  const reading = isReview
    ? `You've reached the end of ${mod.title}. ${mod.blurb} Before moving forward, look back honestly: which of the last fourteen lessons did you actually practice, and which did you only read? Mastery comes from repetition, not exposure \u2014 so today is about consolidation, not new material.`
    : `${pick(READING_TEMPLATES, seed)(title)} ${pick(READING_TEMPLATES_2, seed + 7)(title)}`;

  const example = isReview
    ? `Think of one specific conversation from the past two weeks where you noticed yourself using something from this module \u2014 even imperfectly. Write down what worked.`
    : `Imagine you're mid-conversation and ${title.toLowerCase()} suddenly matters \u2014 a pause gets long, a question catches you off guard, or the room goes quiet. The version of you who practiced this today handles it differently than the version who didn't.`;

  const exercise = isReview
    ? `Choose the single lesson from this module you found hardest. Redo its practice exercise right now, from memory.`
    : `For the next real conversation you have, deliberately apply one piece of today's lesson. Immediately afterward, jot down one sentence about what you noticed.`;

  const reflection = isReview
    ? `What is the one habit from ${mod.title} you want to still be practicing a year from now?`
    : `Where in your life this week will ${title.toLowerCase()} matter most \u2014 and what's stopped you from practicing it before?`;

  const scriptLine = isReview
    ? `"I've been working on ${mod.title.toLowerCase()} \u2014 here's what's actually changed for me."`
    : `"${title}" is easiest to practice with a line like: "Give me a second to think about that" \u2014 a small, real sentence that buys you room to apply today's skill instead of reacting on autopilot.`;

  const quizOptions = [
    "Practicing it once, deliberately, in a real conversation",
    "Reading about it until it feels fully understood",
    "Waiting until you feel naturally confident to try it",
    "Watching other people do it well",
  ];

  return {
    day, title, module: mod.title, moduleKey: mod.key, isReview, difficulty, est,
    objectives, reading, example, tip: pick(TIPS, seed), mistake: pick(MISTAKES, seed + 3),
    exercise, reflection, scriptLine,
    quiz: {
      question: `What actually builds the skill behind "${title}"?`,
      options: quizOptions,
      correctIndex: 0,
    },
  };
}

const ALL_LESSONS = MODULES.flatMap((mod) =>
  mod.topics.map((topic, i) => buildLesson(mod.range[0] + i, topic, mod))
);

const ACHIEVEMENTS = [
  { id: "first", label: "First Lesson", desc: "Complete your first day.", test: (s) => s.completed.length >= 1 },
  { id: "streak7", label: "7-Day Streak", desc: "Seven days completed in a row.", test: (s) => currentStreak(s.completed) >= 7 },
  { id: "mod1", label: "Foundation Set", desc: "Finish Module 1.", test: (s) => moduleDone(s.completed, MODULES[0]) },
  { id: "mod2", label: "Connector", desc: "Finish Module 2.", test: (s) => moduleDone(s.completed, MODULES[1]) },
  { id: "mod3", label: "Workplace Ready", desc: "Finish Module 3.", test: (s) => moduleDone(s.completed, MODULES[2]) },
  { id: "streak30", label: "30-Day Streak", desc: "Thirty days completed in a row.", test: (s) => currentStreak(s.completed) >= 30 },
  { id: "mod4", label: "Interview Expert", desc: "Finish Module 4.", test: (s) => moduleDone(s.completed, MODULES[3]) },
  { id: "mod5", label: "Public Speaker", desc: "Finish Module 5.", test: (s) => moduleDone(s.completed, MODULES[4]) },
  { id: "grad", label: "90-Day Graduate", desc: "Complete all 90 days.", test: (s) => s.completed.length >= 90 },
];

function moduleDone(completed, mod) {
  for (let d = mod.range[0]; d <= mod.range[1]; d++) if (!completed.includes(d)) return false;
  return true;
}
function currentStreak(completed) {
  let streak = 0;
  for (let d = 1; d <= 90; d++) { if (completed.includes(d)) streak++; else break; }
  return streak;
}
function levelFromXp(xp) { return Math.max(1, Math.floor(xp / 150) + 1); }

/* ============================== STORAGE ============================== */

const STORAGE_KEY = "cma_progress_v1";
const DEFAULT_STATE = { completed: [], xp: 0, name: "", notes: {}, bookmarks: [] };

/* ============================== APP ============================== */

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard");
  const [activeDay, setActiveDay] = useState(1);
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [openModule, setOpenModule] = useState(1);
  const [quizPick, setQuizPick] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (mounted && res && res.value) {
          const parsed = JSON.parse(res.value);
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch (e) { /* no saved progress yet */ }
      finally { if (mounted) setLoaded(true); }
    })();
    return () => { mounted = false; };
  }, []);

  const persist = useCallback(async (next) => {
    try { await storage.set(STORAGE_KEY, JSON.stringify(next)); } catch (e) { /* best effort */ }
  }, []);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  const nextDay = useMemo(() => {
    for (let d = 1; d <= 90; d++) if (!state.completed.includes(d)) return d;
    return 90;
  }, [state.completed]);

  const streak = useMemo(() => currentStreak(state.completed), [state.completed]);
  const level = levelFromXp(state.xp);
  const xpIntoLevel = state.xp % 150;
  const pct = Math.round((state.completed.length / 90) * 100);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const openLesson = (day) => {
    setActiveDay(day);
    setQuizPick(null);
    setQuizChecked(false);
    setReflectionDraft(state.notes[day] || "");
    setView("lesson");
    setNavOpen(false);
  };

  const completeLesson = () => {
    if (state.completed.includes(activeDay)) return;
    const gained = 20;
    updateState((prev) => ({
      ...prev,
      completed: [...prev.completed, activeDay].sort((a, b) => a - b),
      xp: prev.xp + gained,
      notes: reflectionDraft ? { ...prev.notes, [activeDay]: reflectionDraft } : prev.notes,
    }));
    setToast(`Day ${activeDay} complete \u00b7 +${gained} XP`);
    setTimeout(() => setToast(null), 2600);
  };

  const saveReflection = (day, text) => {
    setReflectionDraft(text);
    updateState((prev) => ({ ...prev, notes: { ...prev.notes, [day]: text } }));
  };

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.test(state));

  if (!loaded) {
    return (
      <div className="cma-root" data-theme={dark ? "dark" : "light"}>
        <GlobalStyle />
        <div className="loading-screen">
          <div className="loading-wave">
            {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />)}
          </div>
          <p>Opening your academy&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cma-root" data-theme={dark ? "dark" : "light"}>
      <GlobalStyle />
      <div className="shell">
        <Sidebar view={view} setView={setView} navOpen={navOpen} setNavOpen={setNavOpen}
          dark={dark} setDark={setDark} name={state.name} level={level} />

        <main className="main">
          <TopBar view={view} setNavOpen={setNavOpen} streak={streak} xp={state.xp} />

          {view === "dashboard" && (
            <Dashboard state={state} nextDay={nextDay} streak={streak} level={level}
              xpIntoLevel={xpIntoLevel} pct={pct} quote={quote} openLesson={openLesson}
              setView={setView} setOpenModule={setOpenModule} />
          )}

          {view === "curriculum" && (
            <Curriculum state={state} openModule={openModule} setOpenModule={setOpenModule}
              openLesson={openLesson} nextDay={nextDay} />
          )}

          {view === "lesson" && (
            <Lesson lesson={ALL_LESSONS[activeDay - 1]} state={state} activeDay={activeDay}
              setActiveDay={(d) => openLesson(d)} completeLesson={completeLesson}
              quizPick={quizPick} setQuizPick={setQuizPick}
              quizChecked={quizChecked} setQuizChecked={setQuizChecked}
              reflectionDraft={reflectionDraft} saveReflection={saveReflection}
              setView={setView} />
          )}

          {view === "achievements" && (
            <Achievements unlocked={unlockedAchievements.map((a) => a.id)} />
          )}

          {view === "profile" && (
            <Profile state={state} updateState={updateState} level={level} streak={streak} pct={pct} />
          )}
        </main>
      </div>

      {toast && <div className="toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

/* ============================== SIDEBAR / TOPBAR ============================== */

function Sidebar({ view, setView, navOpen, setNavOpen, dark, setDark, name, level }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "curriculum", label: "Curriculum", icon: LayoutGrid },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <>
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}
      <aside className={"sidebar" + (navOpen ? " open" : "")}>
        <div className="brand">
          <div className="brand-mark"><Volume2 size={18} /></div>
          <div>
            <div className="brand-name">Communication</div>
            <div className="brand-sub">Mastery Academy</div>
          </div>
        </div>

        <nav className="nav">
          {items.map((it) => (
            <button key={it.id} className={"nav-item" + (view === it.id ? " active" : "")}
              onClick={() => { setView(it.id); setNavOpen(false); }}>
              <it.icon size={17} /> <span>{it.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="mini-profile">
            <div className="avatar">{(name || "Learner").slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="mini-name">{name || "Learner"}</div>
              <div className="mini-level">Level {level}</div>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ view, setNavOpen, streak, xp }) {
  const titles = { dashboard: "Dashboard", curriculum: "Curriculum", lesson: "Lesson", achievements: "Achievements", profile: "Profile" };
  return (
    <div className="topbar">
      <button className="icon-btn only-mobile" onClick={() => setNavOpen(true)}><Menu size={20} /></button>
      <h1>{titles[view]}</h1>
      <div className="topbar-stats">
        <span className="pill"><Flame size={14} /> {streak}</span>
        <span className="pill"><Sparkles size={14} /> {xp} XP</span>
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ state, nextDay, streak, level, xpIntoLevel, pct, quote, openLesson, setView, setOpenModule }) {
  const nextLesson = ALL_LESSONS[nextDay - 1];
  const mod = MODULES.find((m) => nextDay >= m.range[0] && nextDay <= m.range[1]);

  return (
    <div className="view-pad">
      <section className="hero-card">
        <div className="hero-left">
          <div className="eyebrow">Day {nextDay} of 90 &middot; {mod?.title}</div>
          <h2>{state.completed.length === 0 ? "Ready for your first lesson." : `Welcome back${state.name ? ", " + state.name : ""}.`}</h2>
          <p className="hero-lesson-title">{nextLesson.title}</p>
          <div className="hero-meta">
            <span><Clock size={14} /> {nextLesson.est} min</span>
            <span><Target size={14} /> {nextLesson.difficulty}</span>
          </div>
          <button className="btn-primary" onClick={() => openLesson(nextDay)}>
            {state.completed.includes(nextDay) ? "Review lesson" : "Start today's lesson"} <ArrowRight size={16} />
          </button>
        </div>
        <RingProgress pct={pct} completed={state.completed.length} />
      </section>

      <section className="stat-grid">
        <StatCard icon={Flame} label="Day Streak" value={streak} accent="teal" />
        <StatCard icon={Trophy} label="Level" value={level} sub={`${xpIntoLevel}/150 XP`} accent="gold" />
        <StatCard icon={BookOpen} label="Lessons Done" value={`${state.completed.length}/90`} accent="teal" />
        <StatCard icon={CheckCircle2} label="Program Progress" value={`${pct}%`} accent="gold" />
      </section>

      <section className="waveform-card">
        <div className="waveform-head">
          <h3>Your 90-day rhythm</h3>
          <span className="muted">Each bar is one day &middot; filled means complete</span>
        </div>
        <WaveStrip completed={state.completed} nextDay={nextDay} onPick={openLesson} />
      </section>

      <section className="modules-strip">
        <div className="section-head">
          <h3>Modules</h3>
          <button className="link-btn" onClick={() => setView("curriculum")}>View curriculum <ChevronRight size={14} /></button>
        </div>
        <div className="module-cards">
          {MODULES.map((m) => {
            const total = m.range[1] - m.range[0] + 1;
            const done = state.completed.filter((d) => d >= m.range[0] && d <= m.range[1]).length;
            return (
              <button key={m.id} className="module-card" onClick={() => { setOpenModule(m.id); setView("curriculum"); }}>
                <div className="module-card-top">
                  <span className="module-num">{String(m.id).padStart(2, "0")}</span>
                  {done === total && <CheckCircle2 size={16} className="done-check" />}
                </div>
                <h4>{m.title}</h4>
                <div className="mini-bar"><div style={{ width: `${(done / total) * 100}%` }} /></div>
                <span className="muted small">{done}/{total} days</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="quote-card">
        <Quote size={20} />
        <p>{quote}</p>
      </section>
    </div>
  );
}

function RingProgress({ pct, completed }) {
  const r = 54, c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r={r} className="ring-bg" strokeWidth="10" fill="none" />
        <circle cx="70" cy="70" r={r} className="ring-fg" strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} strokeLinecap="round" />
      </svg>
      <div className="ring-label">
        <span className="ring-pct">{pct}%</span>
        <span className="ring-sub">{completed}/90 days</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={"stat-card accent-" + accent}>
      <Icon size={18} />
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}{sub ? <span className="stat-sub"> &middot; {sub}</span> : null}</div>
      </div>
    </div>
  );
}

function WaveStrip({ completed, nextDay, onPick }) {
  return (
    <div className="wave-strip">
      {Array.from({ length: 90 }).map((_, i) => {
        const day = i + 1;
        const done = completed.includes(day);
        const isNext = day === nextDay;
        const h = 14 + ((day * 37) % 26);
        return (
          <button key={day} title={`Day ${day}`} onClick={() => onPick(day)}
            className={"wave-bar" + (done ? " done" : "") + (isNext ? " next" : "")}
            style={{ height: `${h}px` }} />
        );
      })}
    </div>
  );
}

/* ============================== CURRICULUM ============================== */

function Curriculum({ state, openModule, setOpenModule, openLesson, nextDay }) {
  return (
    <div className="view-pad">
      <p className="view-intro">Six modules, ninety days. Locked days unlock as you complete the one before them &mdash; work at your own pace.</p>
      {MODULES.map((m) => {
        const total = m.range[1] - m.range[0] + 1;
        const done = state.completed.filter((d) => d >= m.range[0] && d <= m.range[1]).length;
        const isOpen = openModule === m.id;
        return (
          <div key={m.id} className="module-block">
            <button className="module-block-head" onClick={() => setOpenModule(isOpen ? null : m.id)}>
              <div className="module-block-left">
                <span className="module-num large">{String(m.id).padStart(2, "0")}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p className="muted">{m.blurb}</p>
                </div>
              </div>
              <div className="module-block-right">
                <span className="muted small">{done}/{total}</span>
                <ChevronRight size={18} className={"chev" + (isOpen ? " open" : "")} />
              </div>
            </button>
            {isOpen && (
              <div className="day-grid">
                {Array.from({ length: total }).map((_, i) => {
                  const day = m.range[0] + i;
                  const lesson = ALL_LESSONS[day - 1];
                  const isDone = state.completed.includes(day);
                  const locked = day > nextDay;
                  return (
                    <button key={day} disabled={locked} onClick={() => openLesson(day)}
                      className={"day-card" + (isDone ? " done" : "") + (locked ? " locked" : "") + (day === nextDay ? " current" : "")}>
                      <div className="day-card-top">
                        <span>Day {day}</span>
                        {isDone ? <CheckCircle2 size={15} /> : locked ? <Lock size={13} /> : <Circle size={15} />}
                      </div>
                      <p>{lesson.title}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== LESSON ============================== */

function Lesson({ lesson, state, activeDay, setActiveDay, completeLesson, quizPick, setQuizPick,
  quizChecked, setQuizChecked, reflectionDraft, saveReflection, setView }) {
  const isDone = state.completed.includes(activeDay);
  const canGoPrev = activeDay > 1;
  const canGoNext = activeDay < 90 && (state.completed.includes(activeDay) || activeDay < Math.max(...state.completed, 0) + 2);

  return (
    <div className="view-pad lesson-pad">
      <button className="link-btn back-link" onClick={() => setView("curriculum")}><ChevronLeft size={15} /> Back to curriculum</button>

      <div className="lesson-head">
        <div className="eyebrow">{lesson.module} &middot; Day {lesson.day}</div>
        <h2>{lesson.title}</h2>
        <div className="hero-meta">
          <span><Clock size={14} /> {lesson.est} min</span>
          <span><Target size={14} /> {lesson.difficulty}</span>
          {isDone && <span className="pill small done-pill"><CheckCircle2 size={13} /> Completed</span>}
        </div>
      </div>

      <LessonSection icon={Target} title="Objectives">
        <ul className="obj-list">{lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
      </LessonSection>

      <LessonSection icon={BookOpen} title="Reading">
        <p>{lesson.reading}</p>
      </LessonSection>

      <LessonSection icon={MessageCircle} title="Real-Life Example">
        <p>{lesson.example}</p>
      </LessonSection>

      <div className="callout tip">
        <Sparkles size={16} />
        <div><strong>Tip</strong><p>{lesson.tip}</p></div>
      </div>

      <div className="callout mistake">
        <HelpCircle size={16} />
        <div><strong>Common mistake</strong><p>{lesson.mistake}</p></div>
      </div>

      <LessonSection icon={MessageCircle} title="Conversation Script">
        <p className="script-line">{lesson.scriptLine}</p>
      </LessonSection>

      <LessonSection icon={Target} title="Practice Exercise">
        <p>{lesson.exercise}</p>
      </LessonSection>

      <LessonSection icon={Mic} title="Speaking Practice">
        <p>Say today's script line out loud, twice. On the second pass, slow down by half and hold eye contact with an imagined listener.</p>
        <div className="fake-recorder">
          <button className="rec-btn"><Mic size={16} /> Record practice</button>
          <span className="muted small">Voice recording &middot; available in the full mobile app</span>
        </div>
      </LessonSection>

      <LessonSection icon={PenLine} title="Reflection">
        <p className="muted small">{lesson.reflection}</p>
        <textarea className="reflection-box" rows={4} placeholder="Write a few honest sentences&hellip;"
          value={reflectionDraft} onChange={(e) => saveReflection(activeDay, e.target.value)} />
      </LessonSection>

      <LessonSection icon={HelpCircle} title="Quiz">
        <p className="quiz-q">{lesson.quiz.question}</p>
        <div className="quiz-options">
          {lesson.quiz.options.map((opt, i) => (
            <button key={i} disabled={quizChecked}
              className={"quiz-opt" + (quizPick === i ? " picked" : "") + (quizChecked && i === lesson.quiz.correctIndex ? " correct" : "") + (quizChecked && quizPick === i && i !== lesson.quiz.correctIndex ? " wrong" : "")}
              onClick={() => setQuizPick(i)}>
              {opt}
            </button>
          ))}
        </div>
        {!quizChecked ? (
          <button className="btn-secondary" disabled={quizPick === null} onClick={() => setQuizChecked(true)}>Check answer</button>
        ) : (
          <p className="quiz-feedback">{quizPick === lesson.quiz.correctIndex ? "Exactly right \u2014 deliberate practice beats passive exposure." : "Not quite \u2014 the skill only forms once you apply it in a real moment."}</p>
        )}
      </LessonSection>

      <div className="lesson-complete-bar">
        <button className="btn-primary wide" onClick={completeLesson} disabled={isDone}>
          {isDone ? <>Completed <CheckCircle2 size={16} /></> : <>Mark Day {activeDay} Complete <CheckCircle2 size={16} /></>}
        </button>
      </div>

      <div className="lesson-nav">
        <button className="link-btn" disabled={!canGoPrev} onClick={() => setActiveDay(activeDay - 1)}><ChevronLeft size={15} /> Day {activeDay - 1}</button>
        <button className="link-btn" disabled={!canGoNext} onClick={() => setActiveDay(activeDay + 1)}>Day {activeDay + 1} <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

function LessonSection({ icon: Icon, title, children }) {
  return (
    <section className="lesson-section">
      <h4><Icon size={15} /> {title}</h4>
      {children}
    </section>
  );
}

/* ============================== ACHIEVEMENTS ============================== */

function Achievements({ unlocked }) {
  return (
    <div className="view-pad">
      <p className="view-intro">{unlocked.length} of {ACHIEVEMENTS.length} unlocked. Keep your streak alive to earn the rest.</p>
      <div className="achv-grid">
        {ACHIEVEMENTS.map((a) => {
          const on = unlocked.includes(a.id);
          return (
            <div key={a.id} className={"achv-card" + (on ? " on" : "")}>
              <div className="achv-icon">{on ? <Trophy size={20} /> : <Lock size={18} />}</div>
              <h4>{a.label}</h4>
              <p className="muted small">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== PROFILE ============================== */

function Profile({ state, updateState, level, streak, pct }) {
  const [nameDraft, setNameDraft] = useState(state.name);
  return (
    <div className="view-pad">
      <section className="profile-card">
        <div className="avatar big">{(nameDraft || "Learner").slice(0, 1).toUpperCase()}</div>
        <div className="profile-fields">
          <label className="field-label">Display name</label>
          <div className="name-row">
            <input className="text-input" value={nameDraft} placeholder="Your name"
              onChange={(e) => setNameDraft(e.target.value)} />
            <button className="btn-secondary" onClick={() => updateState((p) => ({ ...p, name: nameDraft }))}>Save</button>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard icon={Trophy} label="Level" value={level} accent="gold" />
        <StatCard icon={Flame} label="Streak" value={streak} accent="teal" />
        <StatCard icon={BarChart3} label="Progress" value={`${pct}%`} accent="gold" />
        <StatCard icon={Star} label="Total XP" value={state.xp} accent="teal" />
      </section>

      <section className="notes-card">
        <h3><PenLine size={16} /> Your reflection notes</h3>
        {Object.keys(state.notes).length === 0 ? (
          <p className="muted small">Reflections you write on each lesson will collect here.</p>
        ) : (
          <div className="notes-list">
            {Object.entries(state.notes).sort((a, b) => a[0] - b[0]).map(([day, text]) => (
              <div key={day} className="note-item">
                <span className="note-day">Day {day}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================== GLOBAL STYLE ============================== */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

      .cma-root[data-theme="light"] {
        --bg: #F3F0E3; --bg-elev: #FFFFFF; --ink: #1C2620; --muted: #6D7A72;
        --border: #E2DEC9; --gold: #C88A2E; --gold-soft: #F2E2C0; --teal: #2F6E62;
        --teal-soft: #DCEAE6; --shadow: 0 10px 30px -14px rgba(28,38,32,0.18);
        --danger: #B8543F;
      }
      .cma-root[data-theme="dark"] {
        --bg: #14221E; --bg-elev: #1B2C27; --ink: #F1EFE4; --muted: #98A69D;
        --border: #2A3E37; --gold: #E3B15C; --gold-soft: #33301E; --teal: #57AC9C;
        --teal-soft: #1D332E; --shadow: 0 10px 30px -14px rgba(0,0,0,0.5);
        --danger: #E08A73;
      }
      .cma-root {
        font-family: 'Inter', system-ui, sans-serif; color: var(--ink); background: var(--bg);
        min-height: 100vh; width: 100%; -webkit-font-smoothing: antialiased;
      }
      .cma-root * { box-sizing: border-box; }
      .cma-root h1, .cma-root h2, .cma-root h3, .cma-root h4 { font-family: 'Fraunces', serif; margin: 0; font-weight: 600; }
      .cma-root p { margin: 0; line-height: 1.6; color: var(--ink); }
      .cma-root button { font-family: inherit; cursor: pointer; }
      .muted { color: var(--muted); }
      .small { font-size: 12.5px; }

      .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; }
      .loading-wave { display: flex; gap: 4px; align-items: flex-end; height: 40px; }
      .loading-wave span { width: 5px; height: 16px; background: var(--teal); border-radius: 3px; animation: wave 0.9s ease-in-out infinite; }
      @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 34px; } }
      .loading-screen p { color: var(--muted); font-family: 'Fraunces', serif; }

      .shell { display: flex; min-height: 100vh; }

      /* Sidebar */
      .sidebar { width: 240px; flex-shrink: 0; background: var(--bg-elev); border-right: 1px solid var(--border);
        display: flex; flex-direction: column; padding: 22px 16px; position: sticky; top: 0; height: 100vh; }
      .brand { display: flex; align-items: center; gap: 10px; padding: 4px 6px 22px; }
      .brand-mark { width: 34px; height: 34px; border-radius: 10px; background: var(--teal); color: white;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .brand-name { font-family: 'Fraunces', serif; font-size: 14.5px; font-weight: 600; line-height: 1.2; }
      .brand-sub { font-size: 11px; color: var(--muted); letter-spacing: 0.02em; }
      .nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
      .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
        border: none; background: transparent; color: var(--ink); font-size: 14px; text-align: left; }
      .nav-item:hover { background: var(--teal-soft); }
      .nav-item.active { background: var(--teal); color: white; }
      .sidebar-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border); }
      .mini-profile { display: flex; align-items: center; gap: 9px; }
      .avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--gold); color: #2b2110; font-family: 'Fraunces', serif;
        display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
      .avatar.big { width: 56px; height: 56px; font-size: 22px; }
      .mini-name { font-size: 13px; font-weight: 600; }
      .mini-level { font-size: 11px; color: var(--muted); }
      .theme-toggle { border: 1px solid var(--border); background: var(--bg); border-radius: 8px; width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center; color: var(--ink); }
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 39; display: none; }

      .main { flex: 1; min-width: 0; }
      .topbar { display: flex; align-items: center; gap: 12px; padding: 18px 32px; border-bottom: 1px solid var(--border); }
      .topbar h1 { font-size: 19px; flex: 1; }
      .topbar-stats { display: flex; gap: 8px; }
      .pill { display: inline-flex; align-items: center; gap: 5px; background: var(--teal-soft); color: var(--teal);
        padding: 5px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 600; }
      .pill.small { padding: 3px 9px; font-size: 11.5px; }
      .icon-btn { background: none; border: none; color: var(--ink); display: flex; }
      .only-mobile { display: none; }

      .view-pad { padding: 26px 32px 60px; max-width: 980px; }
      .view-intro { color: var(--muted); margin-bottom: 20px; font-size: 14.5px; }

      /* Hero */
      .hero-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 20px; padding: 28px;
        display: flex; align-items: center; justify-content: space-between; gap: 24px; box-shadow: var(--shadow); margin-bottom: 22px; flex-wrap: wrap; }
      .hero-left { flex: 1; min-width: 240px; }
      .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11.5px; color: var(--gold); font-weight: 700; margin-bottom: 8px; font-family: 'IBM Plex Mono', monospace; }
      .hero-card h2 { font-size: 24px; margin-bottom: 6px; }
      .hero-lesson-title { font-size: 16px; color: var(--muted); margin-bottom: 12px; }
      .hero-meta { display: flex; gap: 14px; margin-bottom: 18px; flex-wrap: wrap; }
      .hero-meta span { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--muted); }
      .btn-primary { background: var(--teal); color: white; border: none; padding: 11px 20px; border-radius: 11px;
        font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
      .btn-primary:disabled { opacity: 0.55; cursor: default; }
      .btn-primary.wide { width: 100%; justify-content: center; padding: 13px; }
      .btn-secondary { background: var(--gold-soft); color: var(--gold); border: 1px solid transparent; padding: 9px 16px;
        border-radius: 10px; font-size: 13.5px; font-weight: 600; }
      .btn-secondary:disabled { opacity: 0.5; }
      .link-btn { background: none; border: none; color: var(--teal); font-size: 13.5px; font-weight: 600;
        display: inline-flex; align-items: center; gap: 4px; }
      .link-btn:disabled { color: var(--muted); opacity: 0.5; }

      .ring-wrap { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
      .ring-bg { stroke: var(--border); }
      .ring-fg { stroke: var(--gold); transition: stroke-dashoffset 0.6s ease; transform: rotate(-90deg); transform-origin: 70px 70px; }
      .ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .ring-pct { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; }
      .ring-sub { font-size: 11px; color: var(--muted); }

      /* Stat grid */
      .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }
      .stat-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 14px; padding: 16px;
        display: flex; align-items: flex-start; gap: 10px; }
      .stat-card.accent-teal svg { color: var(--teal); }
      .stat-card.accent-gold svg { color: var(--gold); }
      .stat-value { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; line-height: 1.2; }
      .stat-label { font-size: 12px; color: var(--muted); }
      .stat-sub { color: var(--muted); }

      /* Waveform */
      .waveform-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 18px; padding: 20px 22px; margin-bottom: 22px; }
      .waveform-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 6px; }
      .waveform-head h3 { font-size: 16px; }
      .wave-strip { display: flex; align-items: flex-end; gap: 2.5px; overflow-x: auto; padding-bottom: 4px; }
      .wave-bar { width: 6px; min-width: 6px; border-radius: 3px; border: none; background: var(--border); flex-shrink: 0; align-self: flex-end; transition: background 0.2s; }
      .wave-bar.done { background: var(--teal); }
      .wave-bar.next { background: var(--gold); box-shadow: 0 0 0 2px var(--gold-soft); }

      /* Modules strip */
      .modules-strip { margin-bottom: 22px; }
      .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
      .section-head h3 { font-size: 17px; }
      .module-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .module-card { text-align: left; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 14px;
        padding: 15px; display: flex; flex-direction: column; gap: 6px; color: var(--ink); }
      .module-card-top { display: flex; justify-content: space-between; align-items: center; }
      .module-num { font-family: 'IBM Plex Mono', monospace; color: var(--gold); font-size: 12px; font-weight: 600; }
      .module-num.large { font-size: 22px; background: var(--teal-soft); color: var(--teal); border-radius: 10px; padding: 6px 12px; }
      .done-check { color: var(--teal); }
      .module-card h4 { font-size: 14px; }
      .mini-bar { height: 5px; background: var(--border); border-radius: 4px; overflow: hidden; }
      .mini-bar div { height: 100%; background: var(--teal); }

      .quote-card { display: flex; gap: 12px; align-items: flex-start; background: var(--teal-soft); color: var(--teal);
        border-radius: 16px; padding: 18px 20px; }
      .quote-card p { color: var(--teal); font-family: 'Fraunces', serif; font-style: italic; font-size: 15px; }

      /* Curriculum */
      .module-block { border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; overflow: hidden; background: var(--bg-elev); }
      .module-block-head { width: 100%; background: none; border: none; padding: 18px 20px; display: flex;
        justify-content: space-between; align-items: center; color: var(--ink); text-align: left; }
      .module-block-left { display: flex; gap: 14px; align-items: center; }
      .module-block-left h3 { font-size: 16px; margin-bottom: 3px; }
      .module-block-left p { font-size: 12.5px; }
      .module-block-right { display: flex; align-items: center; gap: 10px; }
      .chev { transition: transform 0.2s; color: var(--muted); }
      .chev.open { transform: rotate(90deg); }
      .day-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 20px 20px; }
      .day-card { text-align: left; background: var(--bg); border: 1px solid var(--border); border-radius: 11px;
        padding: 10px 12px; color: var(--ink); display: flex; flex-direction: column; gap: 5px; }
      .day-card-top { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); }
      .day-card p { font-size: 12.5px; font-weight: 600; }
      .day-card.done { border-color: var(--teal); background: var(--teal-soft); }
      .day-card.done .day-card-top { color: var(--teal); }
      .day-card.current { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-soft); }
      .day-card.locked { opacity: 0.45; cursor: default; }

      /* Lesson */
      .lesson-pad { max-width: 760px; }
      .back-link { margin-bottom: 16px; }
      .lesson-head { margin-bottom: 22px; }
      .lesson-head h2 { font-size: 26px; margin: 4px 0 10px; }
      .done-pill { background: var(--teal); color: white; }
      .lesson-section { margin-bottom: 22px; }
      .lesson-section h4 { display: flex; align-items: center; gap: 7px; font-size: 14px; margin-bottom: 8px; color: var(--teal); text-transform: uppercase; letter-spacing: 0.03em; font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      .obj-list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
      .obj-list li { font-size: 14.5px; }
      .callout { display: flex; gap: 12px; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; }
      .callout strong { display: block; font-size: 13px; margin-bottom: 3px; }
      .callout p { font-size: 13.5px; }
      .callout.tip { background: var(--gold-soft); color: var(--gold); }
      .callout.tip svg, .callout.tip strong { color: var(--gold); }
      .callout.mistake { background: var(--teal-soft); }
      .callout.mistake svg, .callout.mistake strong { color: var(--danger); }
      .script-line { font-style: italic; background: var(--bg-elev); border-left: 3px solid var(--teal); padding: 12px 16px; border-radius: 0 10px 10px 0; }
      .fake-recorder { display: flex; align-items: center; gap: 12px; margin-top: 10px; flex-wrap: wrap; }
      .rec-btn { display: inline-flex; align-items: center; gap: 7px; background: var(--bg-elev); border: 1px solid var(--border);
        padding: 9px 15px; border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--ink); }
      .reflection-box { width: 100%; margin-top: 8px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 12px;
        padding: 12px 14px; color: var(--ink); font-family: inherit; font-size: 13.5px; resize: vertical; }
      .quiz-q { font-weight: 600; margin-bottom: 10px; }
      .quiz-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
      .quiz-opt { text-align: left; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 10px;
        padding: 10px 14px; font-size: 13.5px; color: var(--ink); }
      .quiz-opt.picked { border-color: var(--teal); }
      .quiz-opt.correct { border-color: var(--teal); background: var(--teal-soft); }
      .quiz-opt.wrong { border-color: var(--danger); background: var(--gold-soft); }
      .quiz-feedback { font-size: 13.5px; color: var(--muted); }
      .lesson-complete-bar { margin: 26px 0 14px; }
      .lesson-nav { display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border); }

      /* Achievements */
      .achv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .achv-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 16px; padding: 18px; text-align: center; opacity: 0.5; }
      .achv-card.on { opacity: 1; border-color: var(--gold); }
      .achv-icon { width: 42px; height: 42px; border-radius: 50%; background: var(--gold-soft); color: var(--gold);
        display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
      .achv-card h4 { font-size: 14px; margin-bottom: 4px; }

      /* Profile */
      .profile-card { display: flex; align-items: center; gap: 18px; background: var(--bg-elev); border: 1px solid var(--border);
        border-radius: 16px; padding: 20px; margin-bottom: 20px; }
      .field-label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px; }
      .name-row { display: flex; gap: 8px; }
      .text-input { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 9px 13px;
        color: var(--ink); font-size: 13.5px; width: 220px; }
      .notes-card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
      .notes-card h3 { display: flex; align-items: center; gap: 8px; font-size: 15px; margin-bottom: 14px; }
      .notes-list { display: flex; flex-direction: column; gap: 12px; }
      .note-item { border-left: 3px solid var(--teal); padding-left: 12px; }
      .note-day { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--teal); font-weight: 600; }
      .note-item p { font-size: 13.5px; margin-top: 3px; }

      .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--teal); color: white;
        padding: 12px 20px; border-radius: 12px; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 8px;
        box-shadow: var(--shadow); z-index: 50; }

      @media (max-width: 880px) {
        .sidebar { position: fixed; left: -260px; top: 0; z-index: 40; transition: left 0.25s ease; box-shadow: var(--shadow); }
        .sidebar.open { left: 0; }
        .scrim { display: block; }
        .only-mobile { display: flex; }
        .view-pad { padding: 20px 16px 50px; }
        .topbar { padding: 14px 16px; }
        .stat-grid { grid-template-columns: repeat(2, 1fr); }
        .module-cards { grid-template-columns: 1fr; }
        .day-grid { grid-template-columns: repeat(2, 1fr); }
        .achv-grid { grid-template-columns: repeat(2, 1fr); }
        .hero-card { flex-direction: column; align-items: flex-start; }
      }
    `}</style>
  );
}
