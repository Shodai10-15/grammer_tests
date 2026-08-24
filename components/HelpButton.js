import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function HelpButton({ seatNumber, grammar, step }) {
  const [sent, setSent] = useState(false);

  async function requestHelp() {
    if (!supabase) {
      alert("Supabase未接続です（.env.localを設定してください）");
      return;
    }
    await supabase.from("help_requests").insert({
      seat_number: seatNumber,
      grammar,
      step,
    });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <button className="help-fab" onClick={requestHelp}>
      {sent ? "先生に知らせました！" : "🙋 ヘルプ"}
    </button>
  );
}
