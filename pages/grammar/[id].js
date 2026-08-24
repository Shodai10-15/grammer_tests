import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { getSession } from "../../lib/session";
import Quiz from "../../components/Quiz";
import HelpButton from "../../components/HelpButton";

const GRAMMAR_LABEL = {
  G1: "疑問詞＋to",
  G2: "SVOO＋疑問詞to",
  G3: "感情形容詞＋that",
};

const STEP1_SKILLS = [
  { key: "L", label: "🎧 Listening", desc: "音声を聞いて選ぶ" },
  { key: "R", label: "📖 Reading", desc: "読んで意味を選ぶ" },
  { key: "W", label: "✍️ Writing", desc: "穴埋めで確認する" },
];

const STEP2_SKILLS = [
  { key: "S", label: "🗣️ Speaking＋音声", desc: "聞いてすぐリピート" },
  { key: "W", label: "✍️ Writing", desc: "パターンプラクティス" },
];

export default function GrammarPage() {
  const router = useRouter();
  const { id: grammar } = router.query;
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState([]);
  const [mode, setMode] = useState(null); // {step, skill} or null = menu
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [result, setResult] = useState(null); // {score,total}

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/");
      return;
    }
    setSession(s);
  }, [router]);

  useEffect(() => {
    if (session && grammar) loadProgress();
  }, [session, grammar]);

  async function loadProgress() {
    if (!supabase) return;
    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("seat_number", session.seatNumber)
      .eq("grammar", grammar);
    setProgress(data || []);
  }

  function statusOf(step, skill) {
    const row = progress.find(
      (r) => r.step === step && (skill ? r.skill === skill : true) && r.status === "passed"
    );
    return row ? "passed" : "none";
  }

  const step1Done = progress.some((r) => r.step === 1 && r.status === "passed");
  const step2Done = progress.some((r) => r.step === 2 && r.status === "passed");
  const step3Done = progress.some((r) => r.step === 3 && r.status === "passed");

  async function startQuiz(step, skill) {
    setLoadingQ(true);
    setResult(null);
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("grammar", grammar)
      .eq("step", step)
      .eq("skill", skill)
      .order("sort_order");
    setQuestions(data || []);
    setMode({ step, skill });
    setLoadingQ(false);
  }

  async function saveProgress(step, skill, status, score, total, answerText) {
    if (!supabase) return;
    await supabase.from("progress").upsert(
      {
        seat_number: session.seatNumber,
        grammar,
        step,
        skill: skill || null,
        status,
        score: score ?? null,
        total: total ?? null,
        answer_text: answerText ?? null,
        attempts: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "seat_number,grammar,step,skill" }
    );
    loadProgress();
  }

  async function handleQuizFinish(score, total) {
    const { step, skill } = mode;
    setResult({ score, total });
    // Step1は取り組めば完了（理解の確認）。Step2は満点で合格、そうでなければ再挑戦を促す。
    const passLine = step === 1 ? true : score === total;
    await saveProgress(step, skill, passLine ? "passed" : "in_progress", score, total);
  }

  function backToMenu() {
    setMode(null);
    setQuestions([]);
    setResult(null);
  }

  if (!session || !grammar) return null;

  return (
    <div className="page">
      <div className="header">
        <h1>
          {grammar}　{GRAMMAR_LABEL[grammar]}
        </h1>
        <button className="btn secondary" onClick={() => router.push("/select")}>
          一覧へ
        </button>
      </div>

      {!mode && (
        <>
          <div className="card">
            <p style={{ fontWeight: "bold", marginBottom: 4 }}>Step1　理解</p>
            <p className="muted">好きな技能を1つ以上選んで取り組もう</p>
            <div className="grid">
              {STEP1_SKILLS.map((s) => (
                <div
                  key={s.key}
                  className="tile"
                  onClick={() => startQuiz(1, s.key)}
                >
                  <div>{s.label}</div>
                  <div className="muted">{s.desc}</div>
                  <div className={`badge ${statusOf(1, s.key) === "passed" ? "passed" : "none"}`}>
                    {statusOf(1, s.key) === "passed" ? "完了" : "未"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: "bold", marginBottom: 4 }}>
              Step2　暗記・習熟（合格ライン）
            </p>
            <p className="muted">
              {step1Done ? "満点を取れば合格！間違えたら何度でも挑戦しよう" : "先にStep1を1つ終えよう"}
            </p>
            <div className="grid">
              {STEP2_SKILLS.map((s) => (
                <div
                  key={s.key}
                  className={`tile ${!step1Done ? "locked" : ""}`}
                  onClick={() => step1Done && startQuiz(2, s.key)}
                >
                  <div>{s.label}</div>
                  <div className="muted">{s.desc}</div>
                  <div className={`badge ${statusOf(2, s.key) === "passed" ? "passed" : "none"}`}>
                    {statusOf(2, s.key) === "passed" ? "合格" : "未"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: "bold", marginBottom: 4 }}>
              Step3　応用（ALTの先生に伝えよう）
            </p>
            <p className="muted">
              {step2Done ? "自分の言葉で1文作ろう" : "先にStep2の合格が必要です"}
            </p>
            <div
              className={`tile ${!step2Done ? "locked" : ""}`}
              style={{ maxWidth: 260 }}
              onClick={() => step2Done && setMode({ step: 3 })}
            >
              <div>✨ 応用問題へ</div>
              <div className={`badge ${step3Done ? "passed" : "none"}`}>
                {step3Done ? "提出済み" : "未提出"}
              </div>
            </div>
          </div>
        </>
      )}

      {mode && mode.step !== 3 && !result && loadingQ && <p>読み込み中...</p>}

      {mode && (mode.step === 1 || mode.step === 2) && mode.skill !== "S" && questions.length > 0 && !result && (
        <Quiz questions={questions} onFinish={handleQuizFinish} />
      )}

      {mode && mode.step === 2 && mode.skill === "S" && !result && (
        <SpeakingPractice
          questions={questions}
          onFinish={(score, total) => handleQuizFinish(score, total)}
        />
      )}

      {mode && mode.step === 3 && (
        <Step3Form
          grammar={grammar}
          onSubmit={async (text) => {
            await saveProgress(3, null, "passed", null, null, text);
            setResult({ done: true });
          }}
        />
      )}

      {result && result.total !== undefined && (
        <div className="card">
          <p style={{ fontSize: 18 }}>
            結果：{result.score} / {result.total} 問正解
          </p>
          {mode.step === 2 && result.score !== result.total && (
            <p style={{ color: "#c0392b" }}>
              満点ではなかったので、もう一度挑戦してみよう！
            </p>
          )}
          <div className="btn-row">
            {mode.step === 2 && result.score !== result.total && (
              <button className="btn" onClick={() => startQuiz(mode.step, mode.skill)}>
                もう一度挑戦する
              </button>
            )}
            <button className="btn secondary" onClick={backToMenu}>
              メニューに戻る
            </button>
          </div>
        </div>
      )}

      {result && result.done && (
        <div className="card">
          <p>提出しました！お疲れさまでした。</p>
          <button className="btn secondary" onClick={backToMenu}>
            メニューに戻る
          </button>
        </div>
      )}

      <HelpButton
        seatNumber={session.seatNumber}
        grammar={grammar}
        step={mode ? mode.step : 0}
      />
    </div>
  );
}

function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function SpeakingPractice({ questions, onFinish }) {
  const [checked, setChecked] = useState({});

  function toggle(id) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  const allDone = questions.length > 0 && questions.every((q) => checked[q.id]);

  return (
    <div className="card">
      <p className="muted">
        音声を聞いて、すぐに真似して声に出そう。言えたらチェックしよう（自己録画してもOK）。
      </p>
      {questions.map((q) => (
        <div
          key={q.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <button className="btn secondary" onClick={() => speak(q.question)}>
            🔊
          </button>
          <span style={{ flex: 1 }}>{q.question}</span>
          <input
            type="checkbox"
            checked={!!checked[q.id]}
            onChange={() => toggle(q.id)}
            style={{ width: 22, height: 22 }}
          />
        </div>
      ))}
      <button
        className="btn"
        style={{ marginTop: 16 }}
        disabled={!allDone}
        onClick={() => onFinish(questions.length, questions.length)}
      >
        Step2（Speaking）を完了する
      </button>
    </div>
  );
}

function Step3Form({ onSubmit }) {
  const [text, setText] = useState("");
  const [noted, setNoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="card">
      <p style={{ fontWeight: "bold" }}>
        来年学校に来るALTの先生に教えてあげたいことを、1文で書こう。
      </p>
      <p className="muted">
        例：This shows you how to use the vending machine. / I'm sure this is
        useful for people who are new to Japan.
      </p>
      <input
        type="text"
        placeholder="ここに英文を書こう"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={noted}
          onChange={(e) => setNoted(e.target.checked)}
          style={{ width: 20, height: 20 }}
        />
        発表ノートに書き写した／声に出して読んだ
      </label>
      <button
        className="btn"
        disabled={!text.trim() || !noted || submitting}
        onClick={async () => {
          setSubmitting(true);
          await onSubmit(text.trim());
          setSubmitting(false);
        }}
      >
        提出する
      </button>
    </div>
  );
}
