# 侨批生成器 ·「先生」

> 百年前他坐在祠堂门口替不识字的乡亲写信。百年后,让先生替你写一封。

一个由 DeepSeek V4 Pro 代笔的侨批生成器,为现代人写给父母、祖辈、远方的朋友、已经走了的人。

## 视觉与风格

- 主色:做旧米黄 `#f4ecd8` + 墨黑 `#1a1a1a` + 暗红 `#8b3a3a`
- 字体:Noto Serif SC(UI 与正文)+ LXGW WenKai(「先生」标题)
- 四种笔法:南洋商旅体 / 闺阁守望体 / 少年游子体 / 暮年回望体
- 无 emoji、无现代图标、无渐变色、无卡通元素

## 技术栈

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Framer Motion
- DeepSeek V4 Pro,经由官方 OpenAI 兼容 API(`https://api.deepseek.com/chat/completions`),原生 `fetch` 调用,无 SDK 依赖
- `html-to-image` 用于结果导出

## ⚠️ 关于延迟

DeepSeek V4 Pro 是**推理模型**,会先 reasoning 再输出正文。实测单次生成耗时:

| 风格         | 实测耗时 | 推理 tokens |
|--------------|---------|-------------|
| 南洋商旅体    | ~40s    | ~700        |
| 闺阁守望体    | ~46s    | ~930        |
| 少年游子体    | ~63s    | ~1400       |
| 暮年回望体    | ~165s   | ~4600       |

页面 `GeneratingModal` 已加长动画文案循环周期(7 秒/句,6 句),Vercel API 路由 `maxDuration = 180`。如果希望降低延迟,把 `lib/llm.ts` 中的 `LETTER_MODEL` 改为 `deepseek-chat`(非推理,~5-10s),代价是文采略逊。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
# 在 .env.local 填入 DEEPSEEK_API_KEY
pnpm dev
```

打开 http://localhost:3000。

## 部署到 Vercel

1. 在 GitHub 创建仓库并推送本项目。
2. 登录 [Vercel](https://vercel.com),`Add New → Project`,选中仓库。
3. Vercel 自动识别 Next.js,无需修改构建命令。
4. `Project Settings → Environment Variables` 添加:
   - `DEEPSEEK_API_KEY` = 你的 DeepSeek API key
   - (可选)`DEEPSEEK_BASE_URL` 默认就是 `https://api.deepseek.com`
5. 在 `Project Settings → Functions` 把 `app/api/generate` 的 Max Duration 至少设为 180 秒(Hobby plan 上限 60 秒,需要 Pro plan)。
6. Deploy,绑定自定义域名。

> **Vercel Hobby plan 上限 60 秒**——暮年回望体可能超时被切断。如果用 Hobby plan,建议:把模型换成 `deepseek-chat`,或将 `maxDuration` 设为 60 并在前端给用户加一个超时提示。

## 目录结构

```
.
├── app/
│   ├── layout.tsx               # 根布局 + 字体 + OG
│   ├── globals.css              # 全局样式,字体引入
│   ├── page.tsx                 # 首页 /
│   ├── styles/page.tsx          # 风格选择 /styles
│   ├── write/
│   │   ├── page.tsx             # 输入页外壳(Suspense)
│   │   └── WriteClient.tsx      # 输入页客户端组件
│   ├── letter/[id]/
│   │   ├── page.tsx             # 结果页外壳
│   │   └── LetterClient.tsx     # 结果页客户端组件
│   ├── care/page.tsx            # 自伤检测后的关怀页
│   └── api/generate/route.ts    # AI 生成 + 审核
├── components/
│   ├── PaperBackground.tsx      # 做旧纸张背景
│   ├── LetterPaper.tsx          # 侨批纸张组件
│   ├── Seal.tsx                 # 4 种风格印章 SVG
│   ├── StyleCard.tsx            # 风格选择卡片
│   └── GeneratingModal.tsx      # 研墨落笔动画弹层
├── lib/
│   ├── llm.ts                   # DeepSeek 调用客户端(原生 fetch)
│   ├── styles.ts                # 4 种风格定义与结构模板
│   └── prompts.ts               # Prompt 模板 + 自伤检测 + 审核 Prompt
└── public/
    └── og-image.png             # 分享卡片(请自行替换,1200×630)
```

## 隐私与安全

- 用户输入只在生成请求的生命周期内停留在服务端内存,不写入日志、不持久化。
- 生成结果以 `sessionStorage` 在浏览器端短暂保留,关闭标签即清空。
- 自伤倾向检测:命中关键词时不调用 LLM,直接返回求助页面。
- 双层内容审核:DeepSeek 自身策略 + 生成后再过一次 PASS / BLOCK 审核 prompt。

## OG 图片

`/public/og-image.png` 需要自行生成:1200×630,做旧米黄底,中央一封侨批,标题「先生在等你」。

## License

仅供学习与个人怀念使用。
