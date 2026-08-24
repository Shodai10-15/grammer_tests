# Generates sql/seed_quiz_questions.sql from the same question data used in the xlsx.
def esc(s):
    if s is None:
        return "null"
    return "'" + str(s).replace("'", "''") + "'"

rows = []  # (id, grammar, step, skill, qtype, question, a,b,c,d, correct, note, sort)

def add(gid, grammar, step, skill, qtype, question, a, b, c, d, correct, note, sort):
    rows.append((f"{grammar}-{gid}", grammar, step, skill, qtype, question, a, b, c, d, correct, note, sort))

# ---- G1 ----
g1_l = [
    ("L1","Let me show you how to use the flying umbrella. First, you open it. Then, you say 'up' three times.","空を飛ぶ傘","しゃべる歯ブラシ","透明マント","タイムトラベル自転車","A","どの発明品の話をしているか選ぶ"),
    ("L2","I'll tell you what to do with the talking toothbrush. Just brush your teeth, and it will sing a song for you!","宿題が終わる鉛筆","しゃべる歯ブラシ","透明マント","空を飛ぶ傘","B",""),
    ("L3","Do you know how to use the homework pencil? Just write your name, and it finishes your homework in one second!","一瞬で宿題が終わる鉛筆","タイムトラベル自転車","しゃべる歯ブラシ","空を飛ぶ傘","A",""),
    ("L4","I know where to find the invisible cloak. It's under my bed! When you wear it, nobody can see you.","空を飛ぶ傘","透明マント","宿題が終わる鉛筆","しゃべる歯ブラシ","B",""),
    ("L5","This is the time-travel bike. I'll show you when to use it — only at midnight!","タイムトラベル自転車","透明マント","空を飛ぶ傘","しゃべる歯ブラシ","A",""),
]
for i,(qid,q,a,b,c,d,cor,note) in enumerate(g1_l):
    add(qid,"G1",1,"L","音声",q,a,b,c,d,cor,note,i)

g1_r = [
    ("R1","This umbrella shows you how to fly in the sky.","この傘は空の飛び方を教えてくれる","この傘は空の色を教えてくれる","この傘はいつ開くか教えてくれる","この傘は誰が使うか教えてくれる","A"),
    ("R2","The toothbrush tells you what to sing.","この歯ブラシは歯の磨き方を教えてくれる","この歯ブラシは何を歌うか教えてくれる","この歯ブラシはいつ使うか教えてくれる","この歯ブラシは誰のものか教えてくれる","B"),
    ("R3","I know where to put the magic pencil.","魔法の鉛筆の使い方を知っている","魔法の鉛筆をどこに置くか知っている","魔法の鉛筆が誰のものか知っている","魔法の鉛筆をいつ使うか知っている","B"),
    ("R4","She doesn't know who to ask about the cloak.","彼女はマントの使い方がわからない","彼女はマントをどこに置けばいいかわからない","彼女はマントについて誰に聞けばいいかわからない","彼女はマントがいつ必要かわからない","C"),
    ("R5","Tell me when to ride the time machine bike.","そのバイクの乗り方を教えて","そのバイクをどこで見つけるか教えて","そのバイクが誰のものか教えて","そのバイクにいつ乗ればいいか教えて","D"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g1_r):
    add(qid,"G1",1,"R","問題文",q,a,b,c,d,cor,"",i)

g1_w = [
    ("W1","This sign shows you ___ to use the door.（どうやって使うか）","how","what","where","who","A"),
    ("W2","I don't know ___ to do next.（次に何をすべきか）","where","what","who","when","B"),
    ("W3","Can you tell me ___ to go?（どこへ行くか）","how","when","where","who","C"),
    ("W4","I don't know ___ to ask for help.（誰に）","what","how","when","who","D"),
    ("W5","She told me ___ to start the machine.（いつ）","when","where","who","what","A"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g1_w):
    add(qid,"G1",1,"W","穴埋め",q,a,b,c,d,cor,"",i)

g1_s = [
    ("S1","This shows you how to use the umbrella."),
    ("S2","I know what to do with the toothbrush."),
    ("S3","Tell me where to find the pencil."),
    ("S4","I don't know who to ask about the cloak."),
    ("S5","She knows when to ride the bike."),
]
for i,(qid,q) in enumerate(g1_s):
    add(qid,"G1",2,"S","音声＋リピート",q,None,None,None,None,None,"音声を聞いてすぐリピート→自己録画",i)

g1_p = [
    ("P1","基本文：This shows you how to use it. → what to do に入れ替えると？","This show you what to do.","This shows you what to do.","This shows how you what to do.","This shows you what do.","B"),
    ("P2","基本文：I know where to go. → who to ask に入れ替えると？","I know who to ask.","I know who ask to.","I know to who ask.","I know ask who to.","A"),
    ("P3","基本文：Tell me when to start. → how to start に入れ替えると？","Tell me how start to.","Tell me to how start.","Tell me how to start.","Tell how me to start.","C"),
    ("P4","基本文：She doesn't know what to say. → where to go に入れ替えると？","She doesn't know where to go.","She doesn't know go where to.","She know doesn't where to go.","She doesn't knows where to go.","A"),
    ("P5","基本文：I don't know who to ask. → when to ask に入れ替えると？","I don't know when ask to.","I don't know when to ask.","I don't know to when ask.","I not know when to ask.","B"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g1_p):
    add(qid,"G1",2,"W","入れ替え",q,a,b,c,d,cor,"",i)

# ---- G2 ----
g2_l = [
    ("L1","I'll show my little brother how to use the flying umbrella.","私が弟に傘の使い方を教える","私が弟に鉛筆の使い方を教える","弟が私に傘の使い方を教える","先生が生徒に傘の使い方を教える","A"),
    ("L2","My mom will teach me how to use the talking toothbrush.","母が私に歯ブラシの使い方を教える","私が母に歯ブラシの使い方を教える","母が私にマントの使い方を教える","先生が私に歯ブラシの使い方を教える","A"),
    ("L3","I'll tell you where to find the homework pencil.","私があなたに鉛筆のありかを教える","あなたが私に鉛筆のありかを教える","私があなたに鉛筆の使い方を教える","私があなたにバイクのありかを教える","A"),
    ("L4","The teacher will show us who to ask about the cloak.","私たちが先生にマントについて教える","先生が私たちにマントについて誰に聞くか教える","先生が私たちに歯ブラシについて教える","先生が私たちにいつ聞くか教える","B"),
    ("L5","I'll teach my friend when to ride the time bike.","私が友達にバイクに乗る時を教える","友達が私にバイクに乗る時を教える","私が友達にバイクの直し方を教える","私が友達にバイクの色を教える","A"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g2_l):
    add(qid,"G2",1,"L","音声",q,a,b,c,d,cor,"誰が誰に何を教えるか選ぶ" if i==0 else "",i)

g2_r = [
    ("R1","I'll show you how to use this pencil.","この鉛筆の使い方をあなたに教えます","この鉛筆をどこで買うか教えます","この鉛筆が誰のものか教えます","この鉛筆をいつ使うか教えます","A"),
    ("R2","She'll tell her brother where to put the cloak.","彼女は弟にマントの使い方を教える","彼女は弟にマントをどこに置くか教える","弟が彼女にマントをどこに置くか教える","彼女は弟にマントを見せる","B"),
    ("R3","Can you teach me what to say?","何を言えばいいか教えてくれますか","どこへ行けばいいか教えてくれますか","誰に聞けばいいか教えてくれますか","いつ話せばいいか教えてくれますか","A"),
    ("R4","I'll show my friend who to ask.","友達が私に誰に聞けばいいか教える","私が友達に誰に聞けばいいか教える","私が友達に何を聞けばいいか教える","私が友達にどこで聞けばいいか教える","B"),
    ("R5","He told us when to start.","彼は私たちにどう始めるか教えてくれた","彼は私たちに誰と始めるか教えてくれた","彼は私たちにいつ始めるか教えてくれた","彼は私たちになぜ始めるか教えてくれた","C"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g2_r):
    add(qid,"G2",1,"R","問題文",q,a,b,c,d,cor,"",i)

g2_w = [
    ("W1","I'll ___ you how to use it.（見せながら教える）","show","say","ask","give","A"),
    ("W2","Can you ___ me what to do?（言葉で教えて）","show","tell","make","take","B"),
    ("W3","My teacher will ___ me how to write it.（指導して教える）","show","tell","teach","talk","C"),
    ("W4","I'll ___ you where to go.（言葉で伝える）","tell","teach","look","see","A"),
    ("W5","She will ___ him who to ask.（言葉で伝える）","show","tell","make","play","B"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g2_w):
    add(qid,"G2",1,"W","穴埋め",q,a,b,c,d,cor,"",i)

g2_s = [
    ("S1","I'll show you how to use it."),
    ("S2","I'll tell you where to go."),
    ("S3","Can you teach me what to do?"),
    ("S4","She'll show him who to ask."),
    ("S5","I'll tell you when to start."),
]
for i,(qid,q) in enumerate(g2_s):
    add(qid,"G2",2,"S","音声＋リピート",q,None,None,None,None,None,"音声を聞いてすぐリピート→自己録画",i)

g2_p = [
    ("P1","基本文：I'll show you how to use it. → him に入れ替えると？","I'll show he how to use it.","I'll show him how to use it.","I'll show his how to use it.","I'll shows him how to use it.","B"),
    ("P2","基本文：I'll tell you where to go. → show に入れ替えると？","I'll show you where to go.","I'll shows you where to go.","I'll show to you where go.","I'll told you where to go.","A"),
    ("P3","基本文：Can you teach me what to do? → tell に入れ替えると？","Can you tells me what to do?","Can you tell me what to do?","Can you tell I what to do?","Can tell you me what to do?","B"),
    ("P4","基本文：She'll show him who to ask. → when to ask に入れ替えると？","She'll show him when to ask.","She'll shows him when to ask.","She'll show he when to ask.","She'll show him when ask to.","A"),
    ("P5","基本文：I'll tell you when to start. → them に入れ替えると？","I'll tell they when to start.","I'll tell them when to start.","I'll tells them when to start.","I'll tell them when start to.","B"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g2_p):
    add(qid,"G2",2,"W","入れ替え",q,a,b,c,d,cor,"",i)

# ---- G3 ----
g3_l = [
    ("L1","I'm sure that this pencil will help you.","sure","glad","surprised","sorry","A"),
    ("L2","I'm glad that you can use this umbrella.","surprised","glad","afraid","sorry","B"),
    ("L3","I'm surprised that the toothbrush can sing!","sorry","sure","surprised","glad","C"),
    ("L4","I'm sorry that I broke your cloak.","afraid","sorry","sure","glad","B"),
    ("L5","I'm afraid that the bike is broken.","glad","surprised","sure","afraid","D"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g3_l):
    add(qid,"G3",1,"L","音声",q,a,b,c,d,cor,"使われている感情形容詞を選ぶ" if i==0 else "",i)

g3_r = [
    ("R1","I'm sure that this design is useful.","このデザインは役立つと確信している","このデザインが好きだ","このデザインに驚いた","このデザインが心配だ","A"),
    ("R2","I'm glad that you like it.","あなたが気に入るか心配だ","あなたが気に入ってくれて嬉しい","あなたが気に入って驚いた","あなたが気に入らなくてごめんなさい","B"),
    ("R3","I'm surprised that it works so fast.","こんなに速く動くなんて驚いた","こんなに速く動くと確信している","こんなに速く動いてごめんなさい","こんなに速く動くのが心配だ","A"),
    ("R4","I'm sorry that I'm late.","遅れて嬉しい","遅れて驚いた","遅れてごめんなさい","遅れるのが心配だ","C"),
    ("R5","I'm afraid that it will rain tomorrow.","明日雨が降ると確信している","明日雨が降って嬉しい","明日雨が降るなんて驚いた","明日雨が降るのではないかと心配だ","D"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g3_r):
    add(qid,"G3",1,"R","問題文",q,a,b,c,d,cor,"",i)

g3_w = [
    ("W1","I'm ___ that this is very useful for everyone.（確信）","sure","glad","surprised","sorry","A"),
    ("W2","I'm ___ that you came to see it.（嬉しい）","afraid","glad","sorry","sure","B"),
    ("W3","I'm ___ that it can fly so high!（驚き）","sure","glad","surprised","afraid","C"),
    ("W4","I'm ___ that I forgot your name.（謝罪）","sorry","glad","sure","surprised","A"),
    ("W5","I'm ___ that we will be late.（心配）","glad","sure","afraid","surprised","C"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g3_w):
    add(qid,"G3",1,"W","穴埋め",q,a,b,c,d,cor,"",i)

g3_s = [
    ("S1","I'm sure that this is useful."),
    ("S2","I'm glad that you like it."),
    ("S3","I'm surprised that it works so fast."),
    ("S4","I'm sorry that I broke it."),
    ("S5","I'm afraid that it will rain."),
]
for i,(qid,q) in enumerate(g3_s):
    add(qid,"G3",2,"S","音声＋リピート",q,None,None,None,None,None,"音声を聞いてすぐリピート→自己録画",i)

g3_p = [
    ("P1","基本文：I'm sure that this is useful. → glad に入れ替えると？","I'm glad that this is useful.","I'm glad this that is useful.","I'm glad that this useful is.","I glad that this is useful.","A"),
    ("P2","基本文：I'm glad that you like it. → he likes it に入れ替えると？","I'm glad that he like it.","I'm glad that he likes it.","I'm glad he that likes it.","I'm glad that likes he it.","B"),
    ("P3","基本文：I'm surprised that it works fast. → sure に入れ替えると？","I'm sure that it works fast.","I'm sure that it work fast.","I'm sure it that works fast.","I sure am that it works fast.","A"),
    ("P4","基本文：I'm sorry that I'm late. → afraid に入れ替えると？","I'm afraid I'm that late.","I'm afraid that I'm late.","I afraid am that I'm late.","I'm afraid that I late.","B"),
    ("P5","基本文：I'm afraid that it will rain. → glad に入れ替えると？","I'm glad it that will rain.","I'm glad that it rain will.","I'm glad that it will rain.","I glad that it will rain.","C"),
]
for i,(qid,q,a,b,c,d,cor) in enumerate(g3_p):
    add(qid,"G3",2,"W","入れ替え",q,a,b,c,d,cor,"",i)

lines = ["-- 自動生成: 確認問題の初期データ。sql/schema.sql 実行後に流し込んでください。",
         "delete from quiz_questions;"]
for (id_, grammar, step, skill, qtype, question, a,b,c,d, correct, note, sort) in rows:
    vals = [esc(id_), esc(grammar), step, esc(skill), esc(qtype), esc(question),
            esc(a), esc(b), esc(c), esc(d), esc(correct), esc(note), sort]
    lines.append(
        "insert into quiz_questions (id, grammar, step, skill, qtype, question, choice_a, choice_b, choice_c, choice_d, correct, note, sort_order) values (%s);"
        % ", ".join(str(v) for v in vals)
    )

with open("/home/claude/app/unit5-quiz/sql/seed_quiz_questions.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print(f"generated {len(rows)} rows")
