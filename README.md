# AmaLetter · 先生 · 侨批生成器

> 百年前，他坐在祠堂门口，替不识字的乡亲写信。百年后，让「先生」替你写一封。

![侨批生成器「先生」封面](public/poster.jpg)

AmaLetter 是一个中文 AI 侨批生成器，也叫「先生」。它致敬电影《给阿嬷的情书》和南洋华侨家书里的侨批文化：把今天想对父母、阿公阿嬷、妻子、故友，或已经离开的人说的话，写成一封带着旧日口吻的家书。

在线体验：[https://amaletter.com](https://amaletter.com)

## 它会写什么

「先生」不是通用聊天框，而是一间安静的代笔铺。你只要说清楚收信人、想念的人、近来的处境，系统会按你选的笔法写成一封侨批。

- **四种笔法**：南洋商旅体、闺阁守望体、少年游子体、暮年回望体。
- **五类收信人**：父母、阿公阿嬷、妻子、故友、离开的人。
- **随批寄银两**：可填写「港纸」金额，默认 50，结果页会保留银两提示与动画。
- **一封信可分享**：生成后的侨批会保存为可打开的链接，适合发给微信朋友。
- **装进信封**：结果页可把信件保存成图片，等待下载时会有进度提示。
- **旧时声息**：背景音乐异步加载，默认开启，也可随手关闭。

关键词自然说法：侨批生成器、AI 写信、AI 家书生成器、华侨家书、南洋侨批、潮汕侨批、给阿嬷的情书。

## 看一眼

![写信入口](public/send-letter.jpeg)

![侨批分享卡片](public/og-image.png)

## 技术栈

- Next.js 14 App Router + TypeScript
- Tailwind CSS + Framer Motion
- DeepSeek OpenAI-compatible API，当前默认 `deepseek-v4-flash` no-think 模式
- Supabase，用于保存可分享的信件链接
- `html-to-image`，用于把侨批导出为图片
- Open Graph / Twitter Card / JSON-LD / sitemap / robots，服务于微信分享卡片与基础 SEO

## 本地开发

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

然后打开 [http://localhost:3000](http://localhost:3000)。

必填环境变量放在 `.env.local`，不要提交真实值：

```bash
DEEPSEEK_API_KEY=<your-deepseek-api-key>
```

如需分享链接能在另一台设备打开，还需要 Supabase：

```bash
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

可选：

```bash
DEEPSEEK_BASE_URL=https://api.deepseek.com
NEXT_PUBLIC_SITE_URL=https://amaletter.com
GOOGLE_SITE_VERIFICATION=<google-verification-code>
BAIDU_SITE_VERIFICATION=<baidu-verification-code>
BING_SITE_VERIFICATION=<bing-verification-code>
SO360_SITE_VERIFICATION=<so360-verification-code>
```

## 常用命令

```bash
pnpm dev        # 本地开发
pnpm build      # 生产构建
pnpm typecheck  # TypeScript 检查
```

## 部署

项目适合部署到 Vercel。

1. 在 Vercel 导入 GitHub 仓库。
2. 在 `Project Settings -> Environment Variables` 添加真实环境变量。
3. 设置 `NEXT_PUBLIC_SITE_URL` 为正式域名，例如 `https://amaletter.com`。
4. 部署后确认 `/og-image.png`、`/sitemap.xml`、`/robots.txt` 可访问。

`app/api/generate` 当前以 60 秒函数时长为边界，生成调用本身会在较短时间内超时并重试一次。若更换慢模型，需同步调整函数时长与前端等待提示。

## 隐私与安全

- 真实 API key 只应存在于 `.env.local` 或 Vercel 环境变量中。
- `.env`、`.env.local`、`.vercel` 已在 `.gitignore` 中忽略。
- `.env.example` 只保留占位符，不放任何真实 token。
- DeepSeek key 仅在服务端 API 路由使用，不暴露给浏览器。
- Supabase service role key 仅在服务端使用，不能放入 `NEXT_PUBLIC_*`。
- 用户输入会保存到 Supabase，用于分享链接、来源统计与后续质量分析；如果不配置 Supabase，信件只在当前浏览器会话内可用。
- 自伤风险文本会走关怀页，不进入常规生成流程。

## 目录结构

```text
app/
  api/generate/        # AI 生成、审核、保存
  letter/[id]/         # 分享后的侨批结果页
  styles/              # 笔法选择
  write/               # 写信页
components/            # 纸张、动画、背景音乐、分享与保存组件
lib/                   # LLM、Supabase、prompt、侨批与银两逻辑
public/                # OG 图、海报、音乐、场景图
```

## License

仅供学习、纪念与个人表达使用。请尊重电影、音乐、图片与侨批史料的原始版权。
