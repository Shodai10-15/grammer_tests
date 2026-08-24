import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function HelpButton({ seatNumber, grammar, step }) {
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkActive();
  }, [seatNumber, grammar, step]);

  async function checkActive() {
    if (!supabase || !grammar || !step) return;
    const { data } = await supabase
      .from("help_requests")
      .select("id")
      .eq("seat_number", seatNumber)
      .eq("grammar", grammar)
      .eq("step", step)
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(1);
    setActiveId(data && data.length > 0 ? data[0].id : null);
  }

  async function requestHelp() {
    if (!supabase) {
      alert("Supabase未接続です（.env.localを設定してください）");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("help_requests")
      .insert({ seat_number: seatNumber, grammar, step, resolved: false })
      .select()
      .single();
    if (!error && data) setActiveId(data.id);
    setLoading(false);
  }

  async function resolveHelp() {
    if (!supabase || !activeId) return;
    setLoading(true);
    await supabase
      .from("help_requests")
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", activeId);
    setActiveId(null);
    setLoading(false);
  }

  if (activeId) {
    return (
      <button
        className="help-fab"
        style={{ background: "var(--ok, #2e8b57)" }}
        onClick={resolveHelp}
        disabled={loading}
      >
        ✅ ヘルプを解除する
      </button>
    );
  }

  return (
    <button className="help-fab" onClick={requestHelp} disabled={loading}>
      🙋 ヘルプ
    </button>
  );
}