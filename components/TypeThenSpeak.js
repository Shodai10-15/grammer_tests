import { useState } from "react";
import { listenOnce, isSpeechRecognitionSupported } from "../lib/speechRecognition";
import { wordAccuracy, exactMatch } from "../lib/textSimilarity";

const PASS_THRESHOLD = 80;

// questions: [{id, japanese, english}]
// フェーズ: write（日本語を見て英作文をタイプ）→ speak（英語を隠して日本語だけ見て発話）
export default function TypeThenSpeak({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("write");
  const [input, setInput] = useState("");
  const [writeResult, setWriteResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [speakResult, setSpeakResult] = useState(null);
  const [error, setError] = useState("");

  const supported = isSpeechRecognitionSupported();
  const q = questions[index];

  function checkWrite() {
    if (!input.trim()) {
      setError("英文を入力しよう");
      return;
    }
    setError("");
    const correct = exactMatch(q.english, input);
    const accuracy = wordAccuracy(q.english, input);
    setWriteResult({ correct, accuracy });
  }

  function goToSpeak() {
    setPhase("speak");
    setWriteResult(null);
    setInput("");
  }

  function retryWrite() {
    setWriteResult(null);
    setInput("");
  }

  function startSpeak() {
    if (!supported) {
      setError("このブラウザは音声認識に対応していません（Chrome、またはEdgeでお試しください）");
      return;
    }
    setError("");
    setListening(true);
    setSpeakResult(null);
    listenOnce({
      onResult: (transcript) => {
        const accuracy = wordAccuracy(q.english, transcript);
        setSpeakResult({ accuracy, transcript });
      },
      onError: (err) => {
        setError("うまく聞き取れませんでした（" + err + "）。もう一度試そう");
      },
      onEnd: () => setListening(false),
    });
  }

  function nextQuestion() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPhase("write");
      setInput("");
      setWriteResult(null);
      setSpeakResult(null);
      setError("");
    } else {
      onFinish(questions.length, questions.length);
    }
  }

  const speakPassed = speakResult && speakResult.accuracy >= PASS_THRESHOLD;

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="muted">
        問題 {index + 1} / {questions.length}　
        {phase === "write" ? "①英作文" : "②発話（80%以上で合格）"}
      </p>

      <div className="card">
        <p style={{ fontSize: 18, fontWeight: "bold" }}>{q.japanese}</p>

        {phase === "write" && (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="英文を入力しよう"
              style={{ marginTop: 12 }}
              disabled={!!writeResult}
            />
            {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>{error}</p>}
            {!writeResult && (
              <button className="btn" onClick={checkWrite}>
                答え合わせ
              </button>
            )}
            {writeResult && (
              <div style={{ marginTop: 8 }}>
                <p>
                  {writeResult.correct
                    ? "✅ 正解！"
                    : `一致度 ${writeResult.accuracy}%（正解: ${q.english}）`}
                </p>
                <div className="btn-row">
                  {!writeResult.correct && (
                    <button className="btn secondary" onClick={retryWrite}>
                      もう一度書く
                    </button>
                  )}
                  <button className="btn" onClick={goToSpeak}>
                    発話練習へ進む
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {phase === "speak" && (
          <>
            <p className="muted" style={{ marginTop: 8 }}>
              英語は表示されません。日本語だけを見て、声に出して英語で言おう
            </p>
            {!supported && (
              <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>
                このブラウザは音声認識に対応していません（Chrome、またはEdgeでお試しください）
              </p>
            )}
            <button
              className="btn"
              style={{ marginTop: 8 }}
              onClick={startSpeak}
              disabled={listening || !supported}
            >
              {listening ? "🎤 聞き取り中..." : "🎤 話す"}
            </button>
            {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>{error}</p>}
            {speakResult && (
              <div style={{ marginTop: 8 }}>
                <p className="muted">認識結果: {speakResult.transcript}</p>
                <p>
                  一致度 {speakResult.accuracy}%　
                  {speakPassed ? "✅ 合格！" : "もう少し！もう一度話してみよう"}
                </p>
                <div className="btn-row">
                  {!speakPassed && (
                    <button className="btn secondary" onClick={startSpeak}>
                      もう一度話す
                    </button>
                  )}
                  {speakPassed && (
                    <button className="btn" onClick={nextQuestion}>
                      {index + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
