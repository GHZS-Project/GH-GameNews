# GH-GameNews 交接说明

## 这份仓库是什么

GH-GameNews 是一个在本机运行的中文游戏资讯工作台，负责采集、清洗、阅读、海报和飞书投递。

公开版保留：

- Steam、TapTap、好游快爆、游民星空、机核等来源的采集。
- 今日简讯只读展示。
- 抓取资讯、正文查看和海报素材选择。
- 日报/周报 HTML 与 PNG。
- 飞书游戏库同步、海报机器人和新游/活动提醒。
- 每小时采集、日报、晚报、周报和留档清理调度。

公开版移除：

- “简讯编辑”导航和页面。
- 编辑草稿、拖拽编辑、编辑历史。
- 手动保存/导出编辑稿的 API。

后台仍会在内部生成简讯结构供海报与定时归档使用，这不代表存在编辑器。

## 快速验证

```powershell
npm ci
npm run build
npm run check:crawler
npm run check:poster
npm run dev:server
```

打开 `http://127.0.0.1:64424/`，并检查：

- `#/dash` 能读取今日资讯。
- `#/feed` 能展开来源并查看正文。
- `#/crawler` 能显示来源运行状态。
- 刷新页面后不应出现 `#/brief` 导航。
- `/api/health` 返回 `ok: true`。

如果没有抓取数据，首页可能为空；运行一次页面中的“更新资讯”或 `POST /api/pipeline/run` 后再检查。

## 配置

复制 `.env.example` 为 `.env.local`，主服务会自动加载。没有飞书凭据时，本地资讯和海报仍可使用。

不要提交：

- `FEISHU_*_APP_SECRET`
- `*_CHAT_ID`
- 飞书 Base Token
- 数据库、缓存、日志、备份
- 任何真实 `.env` 文件

## 调度

服务启动后会注册以下调度：

- 每小时 `08:00–23:00`：增量采集与飞书同步。
- 每天 `08:30`：早报内容与日报海报。
- 每天 `17:50`：晚报流水线。
- 每周一 `09:00`：周报。
- 每天 `03:15`：缓存与留档维护。

时间均按运行机器的本地时区解释。

## 关键文件

- `server/index.js`：API、静态文件托管、实例锁。
- `server/scheduler.js`：定时任务和流水线。
- `server/crawler/`：来源适配、过滤、评分、图片。
- `server/briefProjection.js`：今日简讯投影。
- `server/dailyPoster.js`、`server/weeklyPoster.js`：海报 HTML。
- `server/feishuTopicMonitor.js`：飞书游戏库同步。
- `server/feishuTopicNotifier.js`：新游/活动提醒。
- `src/pages/DashboardPage.jsx`：今日简讯阅读。
- `src/pages/FeedPage.jsx`：抓取资讯。
- `src/pages/CrawlerMonitorPage.jsx`：爬虫状态。
- `published-posters/`：公开海报归档。

## 数据边界

- `data/` 和 `output/` 不入库。
- `published-posters/` 入库并作为静态站点发布。
- `dist/` 与 `node_modules/` 不入库。
- 本项目使用独立 SQLite；不会读写原 GameNews 工作区的数据库。

## 给接手 AI 的启动提示

可以把下面这段直接发给接手 AI：

> 请先阅读仓库根目录的 `AGENTS.md`、`README.md` 和 `docs/PUBLIC_HANDOFF.md`。这是一个 Node.js 22 + React 19 + Vite 8 + Express 5 + SQLite 项目。公开版已移除人工简讯编辑器，不要恢复 `#/brief`、`BriefPage` 或 `/api/briefs*` 编辑接口。先只读检查 `package.json`、`server/index.js`、`server/scheduler.js` 和 `src/App.jsx`，再执行 `npm ci`、`npm run build`、`npm run check:crawler`、`npm run check:poster`。运行服务前检查 `.env.local` 是否已由本机准备；不要读取、打印或提交任何真实密钥。完成改动后必须验证 64424 首页、`#/feed`、`#/crawler`、`/api/health` 和 390px 移动端布局。

## 已知部署事项

- 首次启动会创建本地 SQLite 和运行目录。
- 海报 PNG 依赖本机 Edge/Chromium。
- 飞书应用、机器人和目标群需要接手者自行创建或获取授权。
- GitHub 海报自动上传是可选步骤；只有明确配置了发布脚本和远程权限后才启用。
- 仓库里包含公开海报归档，体积约数百 MB；克隆和 Actions 运行会受仓库配额影响。
