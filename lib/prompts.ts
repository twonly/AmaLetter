import { STYLES, type StyleKey } from './styles';

export const SELF_HARM_KEYWORDS = [
  '不想活',
  '不想活了',
  '想死',
  '解脱',
  '再也不想',
  '跳下去',
  '跳楼',
  '安眠药',
  '割腕',
  '自杀',
  '结束自己',
  '一了百了',
  '消失算了',
];

export function detectSelfHarm(input: string): boolean {
  const normalized = input.replace(/\s+/g, '');
  return SELF_HARM_KEYWORDS.some((kw) => normalized.includes(kw));
}

export const SELF_HARM_REPLY = `先生看到你这封信,放下了笔。

有些话需要说给一个真实的人听,不是给我。

如果你现在很难过,请拨打:
- 北京心理危机研究与干预中心:010-82951332
- 上海心理援助热线:021-12320-5

先生在这里等你,但你先去找一个人说说话。`;

export interface LetterPromptInput {
  style: StyleKey;
  userInput: string;
  withMoney: boolean;
  recipient: string;
}

export function buildLetterPrompt({ style, userInput, withMoney, recipient }: LetterPromptInput): string {
  const def = STYLES[style];
  const moneyInstruction = withMoney
    ? '乡亲想寄一点钱,你在信中自然加一句「随附银二元」「另寄叻币十圆」之类,数额合理简短,不必长。'
    : '乡亲此次不寄银钱。整封信内不得出现「银」「钱」「圆」「元」「叻币」「关金」「附寄」任何字眼。';

  const recipientLine = recipient ? `乡亲想写给:${recipient}` : '收件人由风格自行推断。';

  return `你是 1940 年代潮汕侨乡的代笔先生。乡亲跟你口述一段话,你把它「转译」成浅近文言的侨批。

注意:你是转译,不是创作。
- 乡亲说的每一个具体意象——月亮、梦、孩子、寨门、巷子、衣裳、溪水、布料、三轮车、咸菜粥、相片——你都要在文言里找到对应,保留下来。
- 乡亲没提到的事——银钱(除非附银两)、地名、人名、季节、田地、菜——你绝不能补。
- 只加最少的必要的抬头和落款。
- 字数 60-160,根据乡亲说了多少决定,不凑字也不砍内容。

# 范例一

乡亲口述:
昨晚梦见你,你还是我刚走那年的样子,穿着件新衣裳来接我。我们走到寨门口,听到溪水的声音,梦就醒了。

代笔先生誊写(无附银两):
妻鉴。
昨夜梦汝,容颜犹是初别时,着新衣相迎。同行至寨门之下,闻溪水之声,梦遂醒。
夫某手书

# 范例二

乡亲口述:
家里你辛苦了,寄一点钱回去,你别再省着。两个孩子要让他们读书,千万不能让他们去赌。

代笔先生誊写(附银两):
贤妻如晤。
家中操劳,殊为辛苦。随附银二元,望宽用,毋须过俭。
仔儿当令读书,赌博之事千万禁绝。
夫某手书

# 银两

${moneyInstruction}

# 风格

${def.name} —— ${def.recipient}
${def.template}

# 收件人

${recipientLine}

# 乡亲的话

"""
${userInput}
"""

# 自检

写完前,把你信里的每个名词在心里圈出来,看每一个能不能在乡亲的话里找到对应。找不到的删掉。

# 输出

只输出侨批正文。落款单独一段。不要解释、前言、对照说明、markdown 标记。`;
}

export function buildModerationPrompt(letter: string): string {
  return `以下是一封拟生成的侨批,请判断是否涉及:
1. 政治敏感(任何朝代、任何方向,包括影射)
2. 色情或暴力
3. 自伤、自杀倾向(注意:回忆已故亲人不算)
4. 明显的商业广告

只回答 PASS 或 BLOCK,如果 BLOCK 请用一句话(20 字以内)说明原因。

格式严格如下:
PASS
或
BLOCK: 原因

侨批内容:
"""
${letter}
"""`;
}
