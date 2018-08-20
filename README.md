# Intro

- 任务默认每 2 小时执行一次
- 从网站上爬取最新章节，跟本地对比是否为已经爬取过，如果没有则继续并更新本地数据库，反之则停止这次任务
- 拿到了最新内容，将内容推送到 telegram channel

# Dependencies

- Telegram bot - 需要创建 telegram 机器人
- Telegram channel - 需要创建 telegram channel, 并设置机器人为管理员
- If Telegram is blocked in china, Telegram need config proxy,

# Usage

## Installation

```shell
npm install
```

## Config

Add file `config.local.js` to project root directory.

Add config content

```js
{
  module.exports = {
    token: '',
    chatID: '',
    job: '0 */2 * * *'
  }
}
```

add optional config content

```js
{
  module.exports = {
    token: '',
    chatID: '',
    job: '0 */2 * * *',
    proxyHost: '127.0.0.1',
    proxyPort: '1080'
  }
}
```

Get token from https://core.telegram.org/bots/api

Get chatID from telegram channel id

## Run

```shell
npm run start
```
