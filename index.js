const schedule = require('node-schedule');
const story = require('./src/story');
const store = require('./src/store');
const log = require('./src/log');
const config = require('./src/config')();

// 如果没有配置 token, 直接报错
if (!config.token) return log.err('Telegram bot token is needed!');

// 如果没有chat id, 直接报错
if (!config.chatID) return log.err('Telegram chat id is needed!');

// 如果没有配置域名和书籍路径，直接报错
if (!config.domain || !config.bookUrl) return log.err('book config error!');

// 代码执行入口
async function init() {
  const result = await story({ domain: config.domain, bookUrl: config.bookUrl })
  if (result === null) return;

  const { title, content } = result;
  if (store.has(title)) return log.std(`Chapter: ${title} already existed!`);

  const bot = require('./src/bot')(config);
  bot.telegram.sendMessage(config.chatID, content);
  bot.stop();

  store.add(title);
}

// 开启定时任务
schedule.scheduleJob(config.job, init);

log.std('Boot success!');
