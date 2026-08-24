// ディクテーション・シャドーイング・発話チェックで使う、文字列の一致度判定ユーティリティ

export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?'";:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
}

// 単語単位で編集距離を取り、一致度（0〜100）を返す
export function wordAccuracy(target, said) {
  const targetWords = normalize(target).split(" ").filter(Boolean);
  const saidWords = normalize(said).split(" ").filter(Boolean);
  if (targetWords.length === 0) return 0;
  const dist = levenshtein(targetWords, saidWords);
  const maxLen = Math.max(targetWords.length, saidWords.length);
  const accuracy = Math.max(0, (1 - dist / maxLen) * 100);
  return Math.round(accuracy);
}

export function exactMatch(target, said) {
  return normalize(target) === normalize(said);
}
