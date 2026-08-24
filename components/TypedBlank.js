import { useState } from "react";
import { normalize } from "../lib/textSimilarity";

// questions: [{id, question, correct, note}]
// question内の「___」が空欄。correctは正解の単語（英語1語想定）。
export default function TypedBlank({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  const q = questions[index];
  const parts = q.question.split("___");

  function submit() {
    if (!input.trim()) {
      setError("単語を入力してから答え合わせしよう");
      return;
    }
    setError("");
    const correct = normalize(input) === normalize(q.correct);
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setInput("");
      setAnswered(false);
      setError("");
    } else {
      onFinish(score, questions.length);
    }
  }

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="muted">
        問題 {index + 1} / {questions.length}
      </p>
      <div className="card">
        <p style={{ fontSize: 18, fontWeight: "bold", lineHeight: 1.8 }}>
          {parts[0]}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={answered}
            style={{
              display: "inline-block",
              width: 120,
              margin: "0 6px",
              textAlign: "center",
              borderColor: answered ? (isCorrect ? "var(--ok, #2e8b57)" : "var(--danger, #c0392b)") : undefined,
            }}
            placeholder="英単語"
          />
          {parts[1]}
        </p>
        {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>{error}</p>}
        {!answered && (
          <button className="btn" onClick={submit}>
            答え合わせ
          </button>
        )}
        {answered && (
          <div style={{ marginTop: 8 }}>
            <p>
              {isCorrect ? "✅ 正解！" : `❌ 不正解（正解: ${q.correct}）`}
              {q.note ? `　（${q.note}）` : ""}
            </p>
            <button className="btn" onClick={next}>
              {index + 1 < questions.length ? "次の問題へ" : "結果を見る"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
