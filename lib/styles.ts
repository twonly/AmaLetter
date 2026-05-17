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
    template: `结构(请严格按 8 段写,段与段之间空一行):
1. 抬头(如"父亲大人膝下"、"兄长台鉴")
2. 问候(如"敬禀者"、"展信安康")
3. 报平安(儿在外一切顺遂)
4. 报近况(工事 / 生意 / 学业,使用旧词)
5. 说银两(随附 X 元,望以 Y 用之) — 仅当 withMoney 为是
6. 嘱家事(母亲身体 / 田亩 / 弟妹)
7. 思念(一句风物寄思,如"南洋雨季又至,木棉花开三回")
8. 落款(儿 XX 顿首 / 农历某年某月)`,
  },
  maiden: {
    key: 'maiden',
    name: '闺阁守望体',
    recipient: '母亲 · 奶奶 · 外婆 · 远方的女性长辈',
    sample: '前夜梦见家中的旧灶,醒来枕席微凉。',
    description: '婉约温情,风物寄思,不直说但句句是。',
    paperColor: '#f4ece8',
    inkColor: '#2a2a2a',
    sealColor: '#5a3a5a',
    allowDownload: true,
    downloadLabel: '装进信封',
    shareLabel: '让它漂洋过海',
    template: `结构(请严格按 7 段写,段与段之间空一行):
1. 抬头(如"母亲大人膝下")
2. 问候(展信安康)
3. 报平安(儿在外一切尚好)
4. 报一件小事(具体到一只猫、一道菜、一个梦)
5. 担心(听说母亲膝痛 / 头晕,望多保重) — 若用户未提及,则换一种贴身的担忧
6. 一句风物寄思(月、花、雨、海)
7. 落款(儿 XX 顿首)`,
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
    template: `结构(请严格按 6 段写,段与段之间空一行):
1. 抬头(如"吾友 XX 兄")
2. 问候(别来无恙)
3. 报近况(可稍微吹一下,但要有少年感)
4. 回忆一件具体的事(共同的回忆)
5. 约定(他日相见时如何)
6. 落款(弟 XX 拜上)`,
  },
  remembrance: {
    key: 'remembrance',
    name: '暮年回望体',
    recipient: '已经离开的人 · 走了的亲人 · 不在的宠物 · 远去的青春',
    sample: '妈,今年的桂花开了,我还是没学会做你那道糖醋鱼。',
    description: '平静、回忆、不哭,只是说话。',
    paperColor: '#ececec',
    inkColor: '#4a4a4a',
    sealColor: '#6a6a6a',
    allowDownload: false,
    downloadLabel: '留在心里',
    shareLabel: '放进抽屉',
    template: `结构(请严格按 5 段写,段与段之间空一行):
1. 抬头(简单的称呼,如"妈"、"老李",不用敬辞)
2. 报近况(说说自己现在的生活,平淡)
3. 一件想告诉 ta 的事(具体到细节)
4. 一句不直说的思念
5. 落款(只有一个名字和日期,没有"顿首"、没有任何敬辞)

特殊说明:
- 不要写"敬禀者"等敬辞
- 不要用"顿首"落款
- 写的不是"信",是"心里话"
- 平静、不煽情、不直接说"我想你"
- 可以提到"如果你还在"或"你走的那年"`,
  },
};

export const STYLE_ORDER: StyleKey[] = ['merchant', 'maiden', 'youth', 'remembrance'];

export function isStyleKey(value: string | null | undefined): value is StyleKey {
  return value === 'merchant' || value === 'maiden' || value === 'youth' || value === 'remembrance';
}
