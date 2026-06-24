# Neon Oracle Tarot

一个单页赛博塔罗网站：提问、抽卡、正逆位、牌阵解释、牌面解释和 Gemini AI 解读都在同一页。

## 在 VSCode 里运行

1. 打开这个文件夹：
   `C:\Users\86178\Documents\Codex\2026-06-24\ai-gemini-api-ai-vscode`
2. 复制 `.env.example` 为 `.env`。
3. 在 `.env` 里填入：
   `GEMINI_API_KEY=你的Gemini_API_Key`
4. 在 VSCode 终端运行以下任意一种：
   `.\start-dev.ps1`
   
   或者：
   `node server.js`
   
   如果你已经安装了 npm，也可以运行：
   `npm run dev`
5. 浏览器打开：
   `http://localhost:5173`

如果没有配置 `GEMINI_API_KEY`，网站也能运行，会使用本地基础解读。

## 给朋友访问

最简单的方式是部署到支持 Node.js 的平台，例如 Render、Railway、Fly.io 或 Vercel。部署时不要把 Key 写进代码，把 `GEMINI_API_KEY` 放到平台的 Environment Variables / 环境变量里。

## 目前包含

- 5 种牌阵：单张牌、三张时间牌、圣三角、关系牌阵、二选一牌阵
- 78 张塔罗牌基础中文牌义
- 正位 / 逆位随机
- 点击具体牌面才显示牌义
- Gemini 接口代理，避免 API Key 出现在浏览器源码中
