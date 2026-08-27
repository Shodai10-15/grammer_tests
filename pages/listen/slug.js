import { useRouter } from "next/router";
import AudioPlayer from "../../components/AudioPlayer";

// ワークシートのQRコードから飛んでくる、音声再生専用ページ。
// hidden: 英文を表示しない（ディクテーション・リスニング用）
// visible: 英文を表示する（発音確認用）
const SETS = {
  "g1-step1": {
    title: "G1 Step1　リスニング",
    hidden: true,
    items: [
      "I know how to fix this chair.",
      "I understand what to do when the alarm rings.",
      "Do you know where to put the backpack?",
      "She doesn't know who to ask about the bicycle.",
      "I wonder when to water this plant.",
    ],
  },
  "g2-step1": {
    title: "G2 Step1　リスニング",
    hidden: true,
    items: [
      "I'll show my mom how to use this new phone.",
      "I'll tell my brother where to find his shoes.",
      "Can you teach me what to say in English?",
      "The teacher will show us who to ask for help.",
      "I'll tell my friend when to meet at the station.",
    ],
  },
  "g3-step1": {
    title: "G3 Step1　リスニング",
    hidden: true,
    items: [
      "I'm sure that this bag is useful.",
      "I'm glad that you helped me.",
      "I'm surprised that he can swim so fast.",
      "I'm sorry that I broke your pen.",
      "I'm afraid that we will be late.",
    ],
  },
  "g1-step2-dictation": {
    title: "G1 Step2　ディクテーション",
    hidden: true,
    items: [
      "I know how to use the umbrella.",
      "I understand what to do with the toothbrush.",
      "I know where to put the pencil.",
      "She doesn't know who to ask about the cloak.",
      "I wonder when to ride the bike.",
    ],
  },
  "g2-step2-dictation": {
    title: "G2 Step2　ディクテーション",
    hidden: true,
    items: [
      "I'll show you how to use it.",
      "I'll tell you where to go.",
      "Can you teach me what to do?",
      "She'll show him who to ask.",
      "I'll tell you when to start.",
    ],
  },
  "g3-step2-dictation": {
    title: "G3 Step2　ディクテーション",
    hidden: true,
    items: [
      "I'm sure that this is useful.",
      "I'm glad that you like it.",
      "I'm surprised that it works so fast.",
      "I'm sorry that I broke it.",
      "I'm afraid that it will rain.",
    ],
  },
  "g1-step2-pronounce": {
    title: "G1 Step2　発音確認",
    hidden: false,
    items: [
      "I know how to use this umbrella.",
      "I understand what to do with this toothbrush.",
      "I know where to put this pencil.",
      "She doesn't know who to ask about the cloak.",
      "I wonder when to ride this bike.",
    ],
  },
  "g2-step2-pronounce": {
    title: "G2 Step2　発音確認",
    hidden: false,
    items: [
      "I'll show you how to use the umbrella.",
      "My mom will teach me how to use the toothbrush.",
      "I'll tell you where to find the pencil.",
      "The teacher will show us who to ask.",
      "I'll teach my friend when to ride the bike.",
    ],
  },
  "g3-step2-pronounce": {
    title: "G3 Step2　発音確認",
    hidden: false,
    items: [
      "I'm sure that this is useful.",
      "I'm glad that you like it.",
      "I'm surprised that it works so fast.",
      "I'm sorry that I broke it.",
      "I'm afraid that it will rain tomorrow.",
    ],
  },
};

export default function ListenPage() {
  const router = useRouter();
  const { slug } = router.query;
  const set = slug ? SETS[slug] : null;

  if (!slug) return null;
  if (!set) {
    return (
      <div className="page">
        <div className="header">
          <h1>音声が見つかりません</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <h1>{set.title}</h1>
      </div>
      {set.items.map((text, i) => (
        <div className="card" key={i}>
          <p className="muted">問題 {i + 1}</p>
          <AudioPlayer text={text} />
          {!set.hidden && (
            <p style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>{text}</p>
          )}
        </div>
      ))}
    </div>
  );
}
