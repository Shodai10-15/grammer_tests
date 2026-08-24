import { useEffect, useRef, useState } from "react";

// ブラウザの読み上げ機能（Web Speech API）を使った音声プレーヤー。
// 録音ファイルではないため任意の位置へのシークはできませんが、
// 速度変更と「今どこまで読み上げたか」のタイムライン表示に対応しています。
//
// 速度について：スライダーの表示は0.75x〜1.25xだが、
// 実際の読み上げ速度は「表示値 × 0.75」。つまり表示1.00xが、
// もともとの0.75倍速（中学生にとって聞き取りやすい速さ）に相当する。
const BASE_RATE = 0.75;
const WORDS_PER_MINUTE_AT_RATE1 = 150; // ブラウザの読み上げのおおよその速度目安

export default function AudioPlayer({ text }) {
  const [displayRate, setDisplayRate] = useState(1.0);
  const [progress, setProgress] = useState(0); // 0-100
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    setPlaying(false);
    clearTimer();
    return () => {
      clearTimer();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function play() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    clearTimer();

    const actualRate = displayRate * BASE_RATE;
    const wordCount = Math.max(1, text.trim().split(/\s+/).length);
    const estimatedMs = (wordCount / (WORDS_PER_MINUTE_AT_RATE1 * actualRate)) * 60000;

    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = actualRate;

    const startTime = performance.now();
    setPlaying(true);
    setProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(97, (elapsed / estimatedMs) * 100);
      setProgress(pct);
    }, 60);

    utter.onend = () => {
      clearTimer();
      setProgress(100);
      setPlaying(false);
    };
    utter.onerror = () => {
      clearTimer();
      setPlaying(false);
    };

    window.speechSynthesis.speak(utter);
  }

  function stop() {
    clearTimer();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button className="btn secondary" onClick={playing ? stop : play}>
          {playing ? "⏹ 停止" : "🔊 音声を聞く"}
        </button>
        <span style={{ fontSize: 13, color: "var(--text-secondary, #6b7a83)" }}>
          速度 {displayRate.toFixed(2)}x
        </span>
      </div>
      <input
        type="range"
        min="0.75"
        max="1.25"
        step="0.05"
        value={displayRate}
        onChange={(e) => setDisplayRate(parseFloat(e.target.value))}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <div className="progress-bar" style={{ marginBottom: 4 }}>
        <div style={{ width: `${progress}%`, transition: "width 0.06s linear" }} />
      </div>
      <p className="muted" style={{ fontSize: 12, margin: 0 }}>
        再生位置の目安（読み上げ機能のため正確な秒数ではなく推定表示です）
      </p>
    </div>
  );
}