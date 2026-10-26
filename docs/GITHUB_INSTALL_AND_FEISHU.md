# 安装与飞书配置

## 获取与启动

```powershell
git clone https://github.com/A13612812330/GH-GameNews.git
cd GH-GameNews
npm ci
Copy-Item .env.example .env.local
npm run build
npm run dev:server
```

访问 `http://127.0.0.1:64424/`。主服务会自动加载仓库根目录下的 `.env.local`，也可以直接把同名变量设置为 Windows 用户环境变量。

## 飞书配置

真实 App Secret、群 ID 和 Base Token 只保存在本机，不能提交到 GitHub。

| 用途 | 变量 |
| --- | --- |
| 日报/周报机器人 | `FEISHU_POSTER_APP_ID`、`FEISHU_POSTER_APP_SECRET`、`FEISHU_POSTER_CHAT_ID` |
| 新游/活动提醒 | `FEISHU_TOPIC_APP_ID`、`FEISHU_TOPIC_APP_SECRET`、`FEISHU_TOPIC_CHAT_ID` |
| 飞书游戏库 | `FEISHU_MONITOR_APP_ID`、`FEISHU_MONITOR_APP_SECRET`、`FEISHU_MONITOR_APP_TOKEN`、`FEISHU_MONITOR_TABLE_ID`、`FEISHU_MONITOR_RATING_TABLE_ID` |

配置后重启服务。没有飞书凭据时，资讯页面、抓取和本地海报仍可用。

## Windows 常驻运行

先完成构建，再启动项目自带守护脚本：

```powershell
npm run build
npm start
```

守护脚本会保持 `server/index.js` 运行；爬虫、日报、周报和飞书任务的调度都在该服务内。

## 海报公开归档

`published-posters/` 是可随仓库发布的静态归档。新增日报/周报需要自动同步时，可配置本机计划任务运行 `scripts/publish-github-posters.ps1`。该脚本带有公开内容检查和远程提交核验，但这属于可选部署步骤，不影响本地海报生成。

## 常见检查

```powershell
Invoke-WebRequest http://127.0.0.1:64424/api/health
npm run check:crawler
npm run check:poster
```
