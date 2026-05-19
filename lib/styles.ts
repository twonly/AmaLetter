export type StyleKey = 'merchant' | 'maiden' | 'youth' | 'remembrance';

export interface StyleDefinition {
  key: StyleKey;
  name: string;
  recipient: string;
  sample: string;
  description: string;
  paperColor: string;
  inkColor: string;
  sealColor: string;
  template: string;
  allowDownload: boolean;
  downloadLabel: string;
  shareLabel: string;
}

export const STYLES: Record<StyleKey, StyleDefinition> = {
  merchant: {
    key: 'merchant',
    name: '南洋商旅体',
    recipient: '父亲 · 爷爷 · 远方的男性长辈',
    sample: '儿在外一切顺遂,随附拾元,望以家用之。',
    description: '文白相间,稳重克制,报平安、寄银两、嘱家事。',
    paperColor: '#e8dcc0',
    inkColor: '#1a1a1a',
    sealColor: '#8b3a3a',
    allowDownload: true,
    downloadLabel: '装进信封',
    shareLabel: '让它漂洋过海',
    template: `沉稳克制,文白相间。语气适合给男性长辈或正式关系。具体抬头/落款按【收件人关系】决定,不要套默认值。`,
  },
  maiden: {
    key: 'maiden',
    name: '闺阁守望体',
    recipient: '母亲 · 妻子 · 奶奶 · 外婆',
    sample: '前夜梦见家中的旧灶,醒来枕席微凉。',
    description: '婉约温情,风物寄思,不直说但句句是。',
    paperColor: '#f4ece8',
    inkColor: '#2a2a2a',
    sealColor: '#5a3a5a',
    allowDownload: true,
    downloadLabel: '装进信封',
    shareLabel: '让它漂洋过海',
    template: `婉约温情,风物寄思,情感不直白。语气适合给女性亲人/伴侣/恋人。具体抬头/落款按【收件人关系】决定,不要套默认值。`,
  },
  youth: {
    key: 'youth',
    name: '少年游子体',
    recipient: '故友 · 同窗 · 青春记忆里的人',
    sample: '别来无恙否?昔年江边那场雨,我至今未忘。',
    description: '意气、抱负、有点莽撞,旧白话夹少年气。',
    paperColor: '#f4ecd8',
    inkColor: '#1a2a4a',
    sealColor: '#8a6a3a',
    allowDownload: true,
    downloadLabel: '装进信封',
    shareLabel: '让它漂洋过海',
    template: `意气、夹少年气,旧白话夹文言。适合给同龄人 / 朋友 / 同学 / 恋人 / 兄弟姐妹。**不要默认套兄弟相称**,具体抬头/落款按【收件人关系】决定。给女朋友/未婚妻时,自己绝不自称「弟」,落款只用名字+「手书」。`,
  },
  remembrance: {
    key: 'remembrance',
    name: '暮年回望体',
    recipient: '已经离开的人 · 走了的亲人 · 不在的宠物 · 远去的青春',
    sample: '阿公,你抱我走过的那条巷子还在,只是窄了好多。',
    description: '平静、回忆、不哭,只是说话。',
    paperColor: '#ececec',
    inkColor: '#4a4a4a',
    sealColor: '#6a6a6a',
    allowDownload: false,
    downloadLabel: '留在心里',
    shareLabel: '放进抽屉',
    template: `平静、不煽情。给已经离开的人。称呼直接用名字或简单的「妈」「阿公」「老张」「小桐」(不加敬辞,不写「敬禀者」)。落款只用「{自己关系或名字} + 日期」,不写「顿首」「手书」「敬上」等敬辞。**自己跟对方的关系按【收件人关系】决定**:写已故配偶/恋人不要套孙/儿。`,
  },
};

export const STYLE_ORDER: StyleKey[] = ['merchant', 'maiden', 'youth', 'remembrance'];

export function isStyleKey(value: string | null | undefined): value is StyleKey {
  return value === 'merchant' || value === 'maiden' || value === 'youth' || value === 'remembrance';
}

export type RecipientKey = 'mom' | 'dad' | 'grandpa' | 'grandma' | 'wife';

export interface RecipientDefinition {
  key: RecipientKey;
  label: string;
  value: string;
  styleHint: StyleKey;
}

export const RECIPIENTS: RecipientDefinition[] = [
  { key: 'mom', label: '妈', value: '妈', styleHint: 'maiden' },
  { key: 'dad', label: '爸', value: '爸', styleHint: 'merchant' },
  { key: 'grandpa', label: '阿公', value: '阿公', styleHint: 'merchant' },
  { key: 'grandma', label: '阿嬷', value: '阿嬷', styleHint: 'maiden' },
  { key: 'wife', label: '妻子', value: '妻子', styleHint: 'maiden' },
];

export interface DefaultPrompt {
  key: string;
  label: string;
  recipient: string;
  withMoney: boolean;
  text: string;
}

export const DEFAULT_PROMPTS: Record<StyleKey, DefaultPrompt[]> = {
  merchant: [
    {
      key: 'rickshaw',
      label: '今日拉了个重客',
      recipient: '爸',
      withMoney: true,
      text: '爸,今天拉三轮车,接了个四百斤的客人,从早到晚累得腰直不起来。不过这一趟多挣了一块钱,够补贴一点家用。我寄一些钱回去,你别舍不得花。',
    },
    {
      key: 'home-affairs',
      label: '嘱家事,寄一点钱',
      recipient: '妻子',
      withMoney: true,
      text: '家里你辛苦了。我寄一点钱回去,你别再省着用。两个孩子要让他们读书,千万不能让他们去赌。',
    },
    {
      key: 'father-safe',
      label: '给爸报平安',
      recipient: '爸',
      withMoney: false,
      text: '爸,我这边一切都好,你不要挂念。三餐都有,衣裳也添了。你也注意身体,腿不好别再下地了。',
    },
  ],
  maiden: [
    {
      key: 'moonlight',
      label: '一个人望月',
      recipient: '妻子',
      withMoney: false,
      text: '今晚一个人坐在外面,看着月亮升起来,很亮。想到你那边也能看到同一轮月亮。出来三年了,船上的日子过惯了,你别太挂念。',
    },
    {
      key: 'cloth',
      label: '买了布料寄回去',
      recipient: '妈',
      withMoney: false,
      text: '妈,今天上街买了些布料,蓝色和米色的,寄回去给你做件新衣裳。冬天到了,你那件旧的也该换换了。',
    },
    {
      key: 'congee',
      label: '梦见你做的咸菜粥',
      recipient: '阿嬷',
      withMoney: false,
      text: '阿嬷,我这边一切都好,你别担心。这边天冷,你那边也要添衣。前几天梦见你做的咸菜粥。',
    },
    {
      key: 'photo',
      label: '看到孩子长高了',
      recipient: '妻子',
      withMoney: false,
      text: '看到孩子们的相片,长高了好多,差点不认得了。等再做一阵就回家,看你和孩子。',
    },
  ],
  youth: [
    {
      key: 'farewell',
      label: '别后多年,各奔东西',
      recipient: '',
      withMoney: false,
      text: '老周,十二年没见了吧。前阵子翻到我们高三那张合照,还是当年的样子。哪天回老家,牛肉面店见。',
    },
  ],
  remembrance: [
    {
      key: 'grandpa-alley',
      label: '走了的阿公',
      recipient: '阿公',
      withMoney: false,
      text: '阿公,你走了八年了。我今年终于带儿子回了一趟潮州老家。你抱我走过的那条巷子还在,只是窄了好多。',
    },
    {
      key: 'mom-gone',
      label: '走了的妈',
      recipient: '妈',
      withMoney: false,
      text: '妈,今年的桂花又开了。我还是没学会你那道糖醋鱼。前几天搬家,翻出你织的那条围巾,我留着了。',
    },
  ],
};
