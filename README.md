# GH-GameNews

> 中文游戏资讯采集、阅读、日报/周报海报生成与飞书投递工具。

GH-GameNews 面向手游资讯分发场景，从 Steam、TapTap、好游快爆、游民星空、机核等来源采集候选内容，完成清洗、去重、游戏识别与优先级筛选，并提供今日资讯阅读、日报/周报海报和飞书投递。

此公开版本保留资讯采集、今日资讯展示、日报/周报海报、飞书同步与机器人推送；不包含人工简讯编辑器、编辑草稿页面和对应编辑 API。

## 功能

- 资讯采集与清洗：抓取新游、测试、版本更新、活动和端游资讯，保留原文链接。
- 今日资讯阅读：首页按栏目展示当前资讯投影。
- 抓取资讯：查看分来源、分栏目的候选内容与完整正文，并选择海报素材。
- 日报/周报海报：生成 HTML/PNG，归档到 `output/scheduled-posters/`。
- 飞书集成：游戏库同步、海报机器人、新游/活动提醒机器人。
- 本地调度：爬虫监控、日报、周报和留档清理。
- 公开归档：`published-posters/` 保存已发布的日报和周报页面。

真实飞书密钥、群 ID、数据库、采集缓存、日志和备份不会提交到仓库。

## 环境

- Windows 10/11
- Node.js 22 或更新版本（项目使用 `node:sqlite`）
- Microsoft Edge 或 Chromium，用于海报截图

## 启动

```powershell
git clone https://github.com/A13612812330/GH-GameNews.git
cd GH-GameNews
npm ci
Copy-Item .env.example .env.local
npm run build
npm run dev:server
```

浏览器打开 `http://127.0.0.1:64424/`，健康检查为 `http://127.0.0.1:64424/api/health`。

不填写任何飞书变量也可以使用资讯页面、抓取和海报；飞书同步与机器人推送需要自行创建应用、获取凭据并配置群。

Windows 常驻运行可使用：

```powershell
npm start
```

这会启动项目自带的守护脚本。首次在其他电脑部署时，建议先用 `npm run dev:server` 验证页面。

## 配置

`.env.local` 由主服务自动加载，也可以直接设置 Windows 用户环境变量。变量名及用途见 [.env.example](.env.example)，配置步骤见 [docs/GITHUB_INSTALL_AND_FEISHU.md](docs/GITHUB_INSTALL_AND_FEISHU.md)。

| 用途 | 变量 |
| --- | --- |
| 日报/周报机器人 | `FEISHU_POSTER_APP_ID`、`FEISHU_POSTER_APP_SECRET`、`FEISHU_POSTER_CHAT_ID` |
| 新游/活动提醒 | `FEISHU_TOPIC_APP_ID`、`FEISHU_TOPIC_APP_SECRET`、`FEISHU_TOPIC_CHAT_ID` |
| 飞书游戏库 | `FEISHU_MONITOR_APP_ID`、`FEISHU_MONITOR_APP_SECRET`、`FEISHU_MONITOR_APP_TOKEN`、`FEISHU_MONITOR_TABLE_ID`、`FEISHU_MONITOR_RATING_TABLE_ID` |

## 页面

- `#/dash`：今日简讯，只读资讯展示。
- `#/feed`：抓取资讯、正文查看和海报素材选择。
- `#/crawler`：爬虫运行状态、来源进度与最近任务。

## 验证

```powershell
npm run build
npm run check:crawler
npm run check:poster
Invoke-WebRequest http://127.0.0.1:64424/api/health
```

## 文档

- [给其他 AI / 开发者的交接说明](docs/PUBLIC_HANDOFF.md)
- [架构说明](docs/PROJECT_ANALYSIS.md)
- [运行与修改规则](docs/OPERATING_RULES.md)
- [其他电脑安装与飞书配置](docs/GITHUB_INSTALL_AND_FEISHU.md)
- [协作规则](AGENTS.md)

## 数据与安全

- `data/`、`output/`、`logs/`、`backups/`、`node_modules/` 和 `dist/` 均为本机运行数据，不进入版本库。
- `.env.local` 与 `.env` 已被忽略。不要提交 App Secret、机器人凭据、群 ID 或私有 Base Token。
- 本项目与原 GameNews 工作区相互独立；新项目不会读取或覆盖原项目数据库。
- 爬虫仅访问项目已配置的公开来源，不应扩展扫描范围。
