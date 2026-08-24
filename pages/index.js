import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { saveSession, getSession } from "../lib/session";

export default function Login() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      router.replace("/select");
      return;
    }
    async function loadStudents() {
      if (!supabase) return;
      const { data } = await supabase
        .from("students")
        .select("seat_number, name")
        .order("seat_number");
      setStudents(data || []);
    }
    loadStudents();
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!seatNumber) {
      setError("出席番号を選んでください");
      return;
    }
    const classPassword = process.env.NEXT_PUBLIC_CLASS_PASSWORD;
    if (!classPassword) {
      setError(
        "合言葉が設定されていません（.env.localのNEXT_PUBLIC_CLASS_PASSWORDを確認してください）"
      );
      return;
    }
    if (password !== classPassword) {
      setError("合言葉が違います");
      return;
    }
    setLoading(true);
    const student = students.find((s) => s.seat_number === seatNumber);
    saveSession(seatNumber, student ? student.name : seatNumber);
    router.push("/select");
  }

  return (
    <div className="page">
      <div className="header">
        <h1>Unit 5　確認クイズ</h1>
      </div>
      <div className="card">
        <form onSubmit={handleLogin}>
          <label htmlFor="seat">出席番号</label>
          <select
            id="seat"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
          >
            <option value="">選んでください</option>
            {students.map((s) => (
              <option key={s.seat_number} value={s.seat_number}>
                {s.seat_number}　{s.name}
              </option>
            ))}
          </select>

          <label htmlFor="pw">合言葉</label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="先生に聞いた合言葉を入力"
          />

          {error && <p style={{ color: "#c0392b" }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            ログイン
          </button>
        </form>
        {!supabase && (
          <p className="muted" style={{ marginTop: 16 }}>
            ※ Supabaseが未接続です。README.mdの手順に沿って環境変数を設定してください。
          </p>
        )}
      </div>
    </div>
  );
}
