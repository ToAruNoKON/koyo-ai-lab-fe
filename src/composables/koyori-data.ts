export interface DummyStream {
  id: string;
  title: string;
  date: string;
  duration: string;
  tone: string;
  tags: string[];
  topics: string[];
  summary: string | null;
  moments: number;
  transcribed: boolean;
  queueEta?: string;
}

export interface DummyTopic {
  id: string;
  label: string;
  count: number;
  tone: string;
  icon: string;
}

export interface DummyTag {
  tag: string;
  count: number;
}

export interface DummyTranscriptLine {
  t: string;
  speaker: string;
  text: string;
}

export interface DummyMoment {
  t: string;
  label: string;
  score: number;
  type: string;
}

export interface DummyChapter {
  t: string;
  label: string;
  dur: string;
}

export interface DummyJob {
  id: string;
  stream: string;
  stage: string;
  progress: number;
  eta: string | null;
  error: string | null;
}

export interface DummySearchResult {
  stream: string;
  date: string;
  tone: string;
  t: string;
  duration: string;
  snippet: string;
  why: string;
  score: number;
}

export interface DummyChatMessage {
  role: "user" | "ai";
  text: string;
  cites?: Array<{ stream: string; date: string; t: string }>;
}

export const DUMMY_STREAMS: DummyStream[] = [
  {
    id: "s1",
    title: "Karaoke night 🎤 (request box open!!)",
    date: "2026-04-21",
    duration: "3:02:47",
    tone: "pink",
    tags: ["karaoke", "singing"],
    topics: ["music"],
    summary:
      "High-energy karaoke session with viewer requests. Opens with vocal warmups, then 14 songs across J-pop, anime OPs, and a few classics. Ends with a sub-only acoustic encore.",
    moments: 14,
    transcribed: true,
  },
  {
    id: "s2",
    title: "Lab vlog · genome editing news + supacha reading",
    date: "2026-04-19",
    duration: "1:48:12",
    tone: "mint",
    tags: ["vlog", "science"],
    topics: ["lab", "news"],
    summary:
      "Talks through 3 recent CRISPR papers in plain Japanese, then reads superchats.",
    moments: 8,
    transcribed: true,
  },
  {
    id: "s3",
    title: "Minecraft · we're building a giant flask",
    date: "2026-04-17",
    duration: "4:12:33",
    tone: "sage",
    tags: ["minecraft", "gaming", "collab"],
    topics: ["games"],
    summary:
      "Collab with Lui-nee. Builds a 80×80 flask sculpture that doubles as a brewing setup.",
    moments: 11,
    transcribed: true,
  },
  {
    id: "s4",
    title: "Zatsudan · talking about the new outfit",
    date: "2026-04-15",
    duration: "2:21:08",
    tone: "lavender",
    tags: ["zatsudan", "outfit-reveal"],
    topics: ["talk"],
    summary:
      "Outfit reveal stream. Behind-the-scenes from the design process, 3 emote reveals.",
    moments: 6,
    transcribed: true,
  },
  {
    id: "s5",
    title: "Holocure · grinding for the koyori skin",
    date: "2026-04-13",
    duration: "5:34:21",
    tone: "peach",
    tags: ["holocure", "gaming"],
    topics: ["games"],
    summary:
      "5h grind session. Two boss fights at the end where she finally gets the unlock.",
    moments: 9,
    transcribed: true,
  },
  {
    id: "s6",
    title: "Late night study with chat 📚",
    date: "2026-04-12",
    duration: "2:48:55",
    tone: "sky",
    tags: ["study", "chill"],
    topics: ["talk"],
    summary:
      "Pomodoro study session with chat. Quiet talking between rounds, lo-fi BGM.",
    moments: 4,
    transcribed: true,
  },
  {
    id: "s10",
    title: "NEW · Apex Legends ranked grind",
    date: "2026-04-22",
    duration: "4:48:02",
    tone: "sky",
    tags: ["apex", "gaming"],
    topics: ["games"],
    summary: null,
    moments: 0,
    transcribed: false,
    queueEta: "~12 min",
  },
  {
    id: "s11",
    title: "NEW · Cooking stream — onigiri attempt",
    date: "2026-04-22",
    duration: "1:34:12",
    tone: "sage",
    tags: ["cooking", "irl"],
    topics: ["talk"],
    summary: null,
    moments: 0,
    transcribed: false,
    queueEta: "~5 min",
  },
];

export const DUMMY_TOPICS: DummyTopic[] = [
  {
    id: "music",
    label: "Music & singing",
    count: 24,
    tone: "pink",
    icon: "pi pi-volume-up",
  },
  { id: "games", label: "Gaming", count: 47, tone: "sky", icon: "pi pi-play" },
  {
    id: "lab",
    label: "Lab & science",
    count: 11,
    tone: "mint",
    icon: "pi pi-info-circle",
  },
  {
    id: "talk",
    label: "Zatsudan & talk",
    count: 32,
    tone: "lavender",
    icon: "pi pi-comments",
  },
  {
    id: "news",
    label: "News reads",
    count: 6,
    tone: "peach",
    icon: "pi pi-file",
  },
];

export const DUMMY_TAGS: DummyTag[] = [
  { tag: "karaoke", count: 18 },
  { tag: "minecraft", count: 14 },
  { tag: "zatsudan", count: 22 },
  { tag: "singing", count: 25 },
  { tag: "holocure", count: 9 },
  { tag: "chess", count: 6 },
  { tag: "asakoyo", count: 31 },
  { tag: "collab", count: 12 },
  { tag: "apex", count: 8 },
  { tag: "study", count: 7 },
];

export const DUMMY_TRANSCRIPT: DummyTranscriptLine[] = [
  {
    t: "00:00:04",
    speaker: "koyori",
    text: "はいっ、こんこよ〜！博衣こよりです！",
  },
  {
    t: "00:00:08",
    speaker: "koyori",
    text: "今日もラボにようこそ〜。みんな元気だった？",
  },
  {
    t: "00:00:14",
    speaker: "koyori",
    text: "えっとね、今日はカラオケしようと思って。リクエスト箱開けてるから入れてね〜。",
  },
  {
    t: "00:00:22",
    speaker: "koyori",
    text: "あっ、その前にちょっと…のど温めなきゃ。お茶飲も〜。",
  },
  { t: "00:00:31", speaker: "unknown", text: "(BGM start — instrumental)" },
  {
    t: "00:00:48",
    speaker: "koyori",
    text: "よし、じゃあ最初は…定番のあれね！",
  },
  { t: "00:00:55", speaker: "koyori", text: "♪ ～～ ♪" },
  {
    t: "00:01:18",
    speaker: "koyori",
    text: "ふふっ、最初の音外したかも？まあいっか〜！",
  },
  {
    t: "00:01:27",
    speaker: "koyori",
    text: "チャットがすごい速い…みんな嬉しい〜！",
  },
  {
    t: "00:01:36",
    speaker: "koyori",
    text: "えっとね、レンジテストやろうかな。低い方から〜",
  },
  { t: "00:01:45", speaker: "koyori", text: "♪ ら～ら～ら～ ♪" },
  {
    t: "00:01:58",
    speaker: "koyori",
    text: "うわっ、F5届かなかった！(笑)もう一回〜",
  },
  {
    t: "00:02:12",
    speaker: "koyori",
    text: "やっぱりだめ〜！ま、いいや、E5までは出るから！",
  },
  { t: "00:02:24", speaker: "unknown", text: "(viewer superchat sound)" },
  {
    t: "00:02:31",
    speaker: "koyori",
    text: "あっ、スパチャありがと〜！後で読むね！",
  },
  {
    t: "00:02:48",
    speaker: "koyori",
    text: "じゃあ次のリクエスト〜。えっと…ボカロ曲きたよ！",
  },
  {
    t: "00:03:02",
    speaker: "koyori",
    text: "これ昔よく歌ってたな〜。ふふ、懐かしい。",
  },
  { t: "00:03:21", speaker: "koyori", text: "♪ ～～ ♪" },
  { t: "00:04:12", speaker: "koyori", text: "やっぱりこの曲、サビが好き〜！" },
  {
    t: "00:05:01",
    speaker: "koyori",
    text: "みんなも一緒に歌ってる感じがして嬉しい！",
  },
];

export const DUMMY_MOMENTS: DummyMoment[] = [
  { t: "00:01:42", label: "Vocal warmups", score: 0.78, type: "intro" },
  {
    t: "00:08:17",
    label: "First song — high energy opener",
    score: 0.92,
    type: "highlight",
  },
  {
    t: "00:21:34",
    label: "Mistake → laughter (clipworthy)",
    score: 0.96,
    type: "highlight",
  },
  {
    t: "00:35:08",
    label: "Superchat reading break",
    score: 0.61,
    type: "normal",
  },
  {
    t: "00:48:22",
    label: "Ballad — emotional moment",
    score: 0.88,
    type: "highlight",
  },
  { t: "01:12:03", label: "Anime OP medley", score: 0.84, type: "normal" },
  {
    t: "01:34:55",
    label: "Guest cameo (Lui-nee voice)",
    score: 0.94,
    type: "highlight",
  },
  {
    t: "01:58:12",
    label: "Snack break / zatsudan",
    score: 0.55,
    type: "normal",
  },
  {
    t: "02:12:44",
    label: "Sub-only encore — acoustic",
    score: 0.97,
    type: "highlight",
  },
  {
    t: "02:42:18",
    label: "Closing words & schedule",
    score: 0.66,
    type: "outro",
  },
];

export const DUMMY_CHAPTERS: DummyChapter[] = [
  { t: "00:00:00", label: "Greetings & vocal warmups", dur: "8 min" },
  { t: "00:08:17", label: "Song block 1 — J-pop classics", dur: "32 min" },
  { t: "00:40:22", label: "Superchat reading break", dur: "12 min" },
  { t: "00:52:08", label: "Song block 2 — anime OPs", dur: "48 min" },
  { t: "01:34:55", label: "Guest cameo & laughing fit", dur: "6 min" },
  { t: "01:40:55", label: "Song block 3 — viewer requests", dur: "28 min" },
  { t: "02:12:44", label: "Sub-only acoustic encore", dur: "24 min" },
  { t: "02:42:18", label: "Closing & schedule", dur: "12 min" },
];

export const DUMMY_JOBS: DummyJob[] = [
  {
    id: "j1",
    stream: "NEW · Apex Legends ranked grind",
    stage: "transcribing",
    progress: 0.42,
    eta: "6 min",
    error: null,
  },
  {
    id: "j2",
    stream: "NEW · Cooking stream — onigiri",
    stage: "queued",
    progress: 0.0,
    eta: "~5 min",
    error: null,
  },
  {
    id: "j3",
    stream: "Karaoke night 🎤 (encore re-process)",
    stage: "summarizing",
    progress: 0.78,
    eta: "2 min",
    error: null,
  },
  {
    id: "j4",
    stream: "Old archive · Zatsudan from March",
    stage: "failed",
    progress: 0.18,
    eta: null,
    error: "Audio decoding failed at 12:34 (corrupt segment)",
  },
  {
    id: "j5",
    stream: "Minecraft long stream re-summary",
    stage: "done",
    progress: 1.0,
    eta: null,
    error: null,
  },
];

export const DUMMY_SEARCH_RESULTS: DummySearchResult[] = [
  {
    stream: "Karaoke night 🎤",
    date: "2026-04-21",
    tone: "pink",
    t: "01:34:55",
    duration: "0:42",
    snippet:
      "Lui-nee suddenly joins on voice — koyori freezes for two seconds then completely loses it laughing.",
    why: 'closest match: "guest cameo" + "laughter"',
    score: 0.94,
  },
  {
    stream: "Minecraft · giant flask",
    date: "2026-04-17",
    tone: "sage",
    t: "02:48:11",
    duration: "1:08",
    snippet:
      '"Lui-nee, no, that\'s not where the brewing stand goes" — laughing for nearly a minute.',
    why: 'matched: "Lui-nee" + "laughter cluster"',
    score: 0.89,
  },
  {
    stream: "Holocure grind",
    date: "2026-04-13",
    tone: "peach",
    t: "03:21:09",
    duration: "0:33",
    snippet:
      "Lui-nee swings by chat, koyori reads her message out loud, audible grin.",
    why: 'matched: "Lui-nee" mention',
    score: 0.71,
  },
];

export const DUMMY_CHAT_MESSAGES: DummyChatMessage[] = [
  {
    role: "user",
    text: "When does koyori talk about her singing practice routine?",
  },
  {
    role: "ai",
    text: "She mentions her singing practice routine across 4 streams in April. The most detailed walk-through is from the practice stream on April 7.",
    cites: [
      {
        stream: "Singing practice (off-collab prep)",
        date: "2026-04-07",
        t: "00:08:14",
      },
      { stream: "Karaoke night", date: "2026-04-21", t: "00:01:42" },
    ],
  },
  {
    role: "user",
    text: "Does she ever mention specific songs she struggles with?",
  },
];

export function useToneGradient(tone: string): string {
  const gradients: Record<string, string> = {
    pink: "linear-gradient(135deg, #F8C5D6, #E66B8E)",
    mint: "linear-gradient(135deg, #B0E4C8, #2E9B62)",
    sage: "linear-gradient(135deg, #C8E6C9, #4CAF50)",
    sky: "linear-gradient(135deg, #B3D9F7, #2196F3)",
    lavender: "linear-gradient(135deg, #D8B4FE, #7C3AED)",
    peach: "linear-gradient(135deg, #FDD9B5, #F97316)",
  };
  return gradients[tone] ?? "linear-gradient(135deg, #F8C5D6, #E66B8E)";
}
