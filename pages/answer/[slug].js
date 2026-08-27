import { useRouter } from "next/router";

const SETS = {
  "g1-step1-answers": {
    title: "G1 Step1　こたえ合わせ",
    sections: [
      { label: "① Listening", lines: ["① いす", "② めざまし時計", "③ かばん", "④ 自転車", "⑤ 植物"] },
      { label: "② Reading", lines: ["① A", "② A", "③ A", "④ A"] },
      { label: "③ Writing", lines: ["① how", "② what", "③ where", "④ who", "⑤ when"] },
    ],
  },
  "g2-step1-answers": {
    title: "G2 Step1　こたえ合わせ",
    sections: [
      { label: "① Listening", lines: ["① 母に教える", "② 弟に教える", "③ 私に教える", "④ 私たちに教える", "⑤ 友達に教える"] },
      { label: "② Reading", lines: ["① A", "② A", "③ A", "④ A"] },
      { label: "③ Writing", lines: ["① show", "② tell", "③ teach", "④ show", "⑤ tell"] },
    ],
  },
  "g3-step1-answers": {
    title: "G3 Step1　こたえ合わせ",
    sections: [
      { label: "① Listening", lines: ["① sure", "② glad", "③ surprised", "④ sorry", "⑤ afraid"] },
      { label: "② Reading", lines: ["① A", "② A", "③ A", "④ A"] },
      { label: "③ Writing", lines: ["① sure", "② glad", "③ surprised", "④ sorry", "⑤ afraid"] },
    ],
  },
  "g1-step2-answers": {
    title: "G1 Step2　こたえ合わせ",
    sections: [
      {
        label: "① 英作文",
        lines: [
          "① I know how to use this umbrella.",
          "② I understand what to do with this toothbrush.",
          "③ I know where to put this pencil.",
          "④ She doesn't know who to ask about the cloak.",
          "⑤ I wonder when to ride this bike.",
        ],
      },
      {
        label: "② ディクテーション",
        lines: [
          "① I know how to use the umbrella.",
          "② I understand what to do with the toothbrush.",
          "③ I know where to put the pencil.",
          "④ She doesn't know who to ask about the cloak.",
          "⑤ I wonder when to ride the bike.",
        ],
      },
    ],
  },
  "g2-step2-answers": {
    title: "G2 Step2　こたえ合わせ",
    sections: [
      {
        label: "① 英作文",
        lines: [
          "① I'll show you how to use the umbrella.",
          "② My mom will teach me how to use the toothbrush.",
          "③ I'll tell you where to find the pencil.",
          "④ The teacher will show us who to ask.",
          "⑤ I'll teach my friend when to ride the bike.",
        ],
      },
      {
        label: "② ディクテーション",
        lines: [
          "① I'll show you how to use it.",
          "② I'll tell you where to go.",
          "③ Can you teach me what to do?",
          "④ She'll show him who to ask.",
          "⑤ I'll tell you when to start.",
        ],
      },
    ],
  },
  "g3-step2-answers": {
    title: "G3 Step2　こたえ合わせ",
    sections: [
      {
        label: "① 英作文",
        lines: [
          "① I'm sure that this is useful.",
          "② I'm glad that you like it.",
          "③ I'm surprised that it works so fast.",
          "④ I'm sorry that I broke it.",
          "⑤ I'm afraid that it will rain tomorrow.",
        ],
      },
      {
        label: "② ディクテーション",
        lines: [
          "① I'm sure that this is useful.",
          "② I'm glad that you like it.",
          "③ I'm surprised that it works so fast.",
          "④ I'm sorry that I broke it.",
          "⑤ I'm afraid that it will rain.",
        ],
      },
    ],
  },
};

export default function AnswerPage() {
  const router = useRouter();
  const { slug } = router.query;
  const set = slug ? SETS[slug] : null;

  if (!slug) return null;
  if (!set) {
    return (
      <div className="page">
        <div className="header">
          <h1>こたえが見つかりません</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <h1>{set.title}</h1>
      </div>
      {set.sections.map((sec, i) => (
        <div className="card" key={i}>
          <p className="section-title">{sec.label}</p>
          {sec.lines.map((l, j) => (
            <p key={j} style={{ fontSize: 16, margin: "4px 0" }}>
              {l}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
