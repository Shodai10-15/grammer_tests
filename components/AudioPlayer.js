import { useEffect, useRef, useState } from "react";

// ブラウザの読み上げ機能（Web Speech API）を使った音声プレーヤー。
// 録音ファイルではないため任意の位置へのシークはできませんが、
// 速度変更と「今どこまで読み上げたか」のタイムライン表示に対応しています。
export default function AudioPlayer({ text }) {
  const [rate, setRate] = useState(1.0);
  const [progress, setProgress] = useState(0); // 0-100
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    setPlaying(false);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  function play() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = rate;
    utter.onstart = () => {
      setPlaying(true);
      setProgress(0);
    };
    utter.onboundary = (e) => {
      if (text.length > 0) {
        setProgress(Math.min(100, Math.round((e.charIndex / text.length) * 100)));
      }
    };
    utter.onend = () => {
      setProgress(100);
      setPlaying(false);
    };
    utter.onerror = () => {
      setPlaying(false);
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function stop() {
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
          速度 {rate.toFixed(2)}x
        </span>
      </div>
      <input
        type="range"
        min="0.75"
        max="1.25"
        step="0.05"
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <div className="progress-bar" style={{ marginBottom: 4 }}>
        <div style={{ width: `${progress}%`, transition: "width 0.15s linear" }} />
      </div>
      <p className="muted" style={{ fontSize: 12, margin: 0 }}>
        再生位置の目安（読み上げ機能のため正確な秒数は表示されません）
      </p>
    </div>
  );
}
