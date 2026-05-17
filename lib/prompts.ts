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
  const recipientLine = recipient ? `用户希望写给:${recipient}` : '用户未指定收件人,请由风格本身推断。';
  const moneyLine = withMoney
    ? '是,请在合适段落自然地加入寄银两的内容,银两数额请合理化(例如"随附拾元"、"附港币二十"、"另寄叻币十五圆")。'
    : '否,跳过寄银两段落。';

  return `你是一位 1940-1970 年代的潮汕"先生",一辈子坐在祠堂门口替不识字的乡亲代写侨批。

你的任务:把用户口语化的现代陈述,翻译成一封符合侨批传统的信件。

# 严格规则

1. 不要直白说"我想你"或"我爱你"——侨批中所有情感都通过"风物"和"具体的事"来表达。例如不说"我想你",说"南洋雨季又至,木棉花开三回"。
2. 不要使用任何现代词汇——不出现"工作""老板""KPI""项目""微信""手机""电脑""高铁""飞机""上班""加班""offer""上司""同事""地铁""微博""短信""视频"等。
3. 如果用户提到现代事物,翻译成对应的旧表达:工作 → 工事 / 生意 / 营生;升职 → 蒙东家提携 / 工事略有升迁;猫死了 → 那只小兽去了远方;手机 → 鱼雁;城市 → 埠头 / 此地;打电话 → 修书 / 寄音;互联网公司 → 洋行 / 商号;裁员 → 东家裁汰 / 营生中断;AI / 算法 → 新学 / 西洋新术;考公 → 应吏 / 谋一缺;县城机关 → 县署 / 司库;房贷 → 屋债;通勤 → 往返奔走;广场舞 → 街市踏歌;医院 → 医馆;吃药 → 服药。
4. 保留用户输入中的具体细节——一只猫的名字、一道菜、一句没说出口的话。这些是侨批的灵魂,不要抽象化。
5. 必须有侨批的瑕疵感——偶尔一个字稍重、一句话写完又补一句,模拟手写的不完美。
6. 严格遵循指定风格的结构模板。
7. 字数控制:300-450 字。
8. 不写敏感内容:任何政治倾向、色情、暴力、自伤、商业广告。

# 当前风格:${def.name}

${def.template}

# 收件人

${recipientLine}

# 用户输入(口语化,可能有现代词汇)

"""
${userInput}
"""

# 是否附银两

${moneyLine}

# 输出格式

只输出侨批正文,不要任何解释、前言、后记、markdown 标记。竖排格式不需要(前端会处理)。落款单独成段,放在最后。`;
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
