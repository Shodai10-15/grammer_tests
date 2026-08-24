import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { listenOnce, isSpeechRecognitionSupported } from "../lib/speechRecognition";
import { wordAccuracy, exactMatch } from "../lib/textSimilarity";

const PASS_THRESHOLD = 80;

// questions: [{id, question}]  question = 正解の英文
// フェーズ: dictation（聞いて書き取る）→ shadowing（見ながら音読して一致度を判定）
export default function DictationShadowing({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("dictation"); // dictation | shadowing | done
  const [input, setInput] = useState("");
  const [dictationResult, setDictationResult] = useState(null); // {correct, accuracy}
  const [listening, setListening] = useState(false);
  const [shadowResult, setShadowResult] = useState(null); // {accuracy, transcript}
  const [error, setError] = useState("");

  const supported = isSpeechRecognitionSupported();
  const q = questions[index];

  function checkDictation() {
    if (!input.trim()) {
      setError("聞き取った英文を入力しよう");
      return;
    }
    setError("");
    const correct = exactMatch(q.question, input);
    const accuracy = wordAccuracy(q.question, input);
    setDictationResult({ correct, accuracy });
  }

  function goToShadowing() {
    setPhase("shadowing");
    setDictationResult(null);
    setInput("");
  }

  function retryDictation() {
    setDictationResult(null);
    setInput("");
  }

  function startShadowing() {
    if (!supported) {
      setError("このブラウザは音声認識に対応していません（Chrome、またはEdgeでお試しください）");
      return;
    }
    setError("");
    setListening(true);
    setShadowResult(null);
    listenOnce({
      onResult: (transcript) => {
        const accuracy = wordAccuracy(q.question, transcript);
        setShadowResult({ accuracy, transcript });
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
      setPhase("dictation");
      setInput("");
      setDictationResult(null);
      setShadowResult(null);
      setError("");
    } else {
      onFinish(questions.length, questions.length);
    }
  }

  const shadowPassed = shadowResult && shadowResult.accuracy >= PASS_THRESHOLD;

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="muted">
        問題 {index + 1} / {questions.length}　
        {phase === "dictation" ? "①ディクテーション" : "②シャドーイング"}
      </p>

      {phase === "dictation" && (
        <div className="card">
          <p className="muted" style={{ marginBottom: 8 }}>
            音声を聞いて、聞こえた英文をそのまま入力しよう
          </p>
          <AudioPlayer text={q.question} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="聞こえた英文を入力"
            style={{ marginTop: 12 }}
            disabled={!!dictationResult}
          />
          {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>{error}</p>}
          {!dictationResult && (
            <button className="btn" onClick={checkDictation}>
              答え合わせ
            </button>
          )}
          {dictationResult && (
            <div style={{ marginTop: 8 }}>
              <p>
                {dictationResult.correct
                  ? "✅ 正解！"
                  : `一致度 ${dictationResult.accuracy}%（正解: ${q.question}）`}
              </p>
              <div className="btn-row">
                {!dictationResult.correct && (
                  <button className="btn secondary" onClick={retryDictation}>
                    もう一度書く
                  </button>
                )}
                <button className="btn" onClick={goToShadowing}>
                  シャドーイングへ進む
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "shadowing" && (
        <div className="card">
          <p className="muted" style={{ marginBottom: 8 }}>
            英文を見ながら、音声のあとに続いて声に出して読もう（80%以上の一致で合格）
          </p>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>{q.question}</p>
          <AudioPlayer text={q.question} />
          {!supported && (
            <p style={{ color: "var(--danger, #c0392b)", fontSize: 13, marginTop: 8 }}>
              このブラウザは音声認識に対応していません（Chrome、またはEdgeでお試しください）
            </p>
          )}
          <button
            className="btn"
            style={{ marginTop: 12 }}
            onClick={startShadowing}
            disabled={listening || !supported}
          >
            {listening ? "🎤 聞き取り中..." : "🎤 話す"}
          </button>
          {error && <p style={{ color: "var(--danger, #c0392b)", fontSize: 13 }}>{error}</p>}
          {shadowResult && (
            <div style={{ marginTop: 8 }}>
              <p className="muted">認識結果: {shadowResult.transcript}</p>
              <p>
                一致度 {shadowResult.accuracy}%　
                {shadowPassed ? "✅ 合格！" : "もう少し！もう一度話してみよう"}
              </p>
              <div className="btn-row">
                {!shadowPassed && (
                  <button className="btn secondary" onClick={startShadowing}>
                    もう一度話す
                  </button>
                )}
                {shadowPassed && (
                  <button className="btn" onClick={nextQuestion}>
                    {index + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
