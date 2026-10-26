# 项目架构

## 定位

GH-GameNews 是本地运行的中文游戏资讯工作台。前端负责读取和筛选资讯，后端负责爬取、清洗、评分、海报生成、飞书同步和定时调度。

公开版不提供人工简讯编辑器；后台仍可生成内部简讯结构供日报/周报使用，但相关编辑 API 和页面已移除。

## 技术栈

- React 19 + Vite 8
- Express 5
- Node.js ESM
- SQLite `node:sqlite`
- node-cron
- 飞书开放平台 API
- Playwright/Chromium 截图用于海报 PNG

## 目录

```text
src/
  App.jsx                    Hash 路由
  components/AppShell.jsx    导航、主题、海报操作
  pages/DashboardPage.jsx    今日简讯只读展示
  pages/FeedPage.jsx         抓取资讯与正文查看
  pages/CrawlerMonitorPage.jsx 爬虫状态
  services/api.js            API 客户端
  utils/export.js            下载与内容展示辅助
server/
  index.js                   HTTP API、静态文件、实例锁
  env.js                     .env.local / .env 加载
  database.js                SQLite、文章、内部简讯持久化
  briefProjection.js         首页投影与筛选
  scheduler.js               定时采集、日报/周报、飞书任务
  crawler/                   来源注册、解析、评分、去重、图片
  dailyPoster.js             日报 HTML
  weeklyPoster.js            周报 HTML
  feishuTopicMonitor.js      飞书游戏库同步
  feishuTopicNotifier.js     新游/活动提醒
scripts/                     回归检查、维护、归档、发布工具
public/                      静态图标
published-posters/           已公开的日报/周报归档
docs/                        当前文档
```

## 数据流

```text
已配置来源
  -> 候选采集
  -> 清洗与稳定 ID
  -> 分数和分类
  -> 详情、正文、图片
  -> SQLite
  -> Dashboard 投影 / RAW 快照
  -> 资讯页面
  -> 日报或周报 HTML
  -> PNG 截图校验
  -> 飞书机器人
  -> published-posters 可选公开归档
```

## 前端路由

- `#/dash`：今日资讯投影，只读。
- `#/feed`：分来源、分栏目查看候选，读取完整内容，选择海报范围。
- `#/crawler`：各来源最近运行、写入数量、失败和 RAW 统计。

`#/brief` 不存在，人工编辑器已从公开版移除。

## 服务端口

- `64424`：正式页面与 API 同端口。
- `64423`：仅在 `GAMENEWS_DEV_CLIENT=1` 时用于 Vite 热更新。
- `64425`：可选的独立海报静态服务，不应暴露后端 API。

## API 分组

- 健康与来源：`/api/health`、`/api/sources`
- 采集：`/api/crawl/candidates`、`/api/crawl/details`、`/api/crawl/status`
- 读取：`/api/dashboard`、`/api/dashboard/detail/:id`、`/api/raw-feed`
- 海报：`/api/daily-poster/*`、`/api/weekly-poster/*`
- 流水线：`/api/pipeline/run`

人工编辑接口 `/api/briefs*`、`/api/brief/archive*` 和 `/api/daily-brief` 已移除。

## 数据边界

- `data/`：SQLite、抓取缓存、快照和运行日志。
- `output/`：本机海报和生成结果。
- `logs/`、`backups/`：本地运维数据。
- `published-posters/`：面向公开访问的已归档海报。

公开仓库只应包含源码、必要静态资源、文档和公开归档。

## 启动顺序

1. `server/env.js` 读取仓库根目录的 `.env.local` 或 `.env`。
2. `server/index.js` 获取实例锁。
3. 初始化 SQLite 与内置来源。
4. 启动定时调度。
5. 托管 `dist/`、`public/` 和 API。

数据库在首次启动时创建；未构建 `dist/` 时页面无法正常打开，因此部署先执行 `npm run build`。
