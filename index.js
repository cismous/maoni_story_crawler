const schedule = require('node-schedule');
const story = require('./src/story');
const store = require('./src/store');
const log = require('./src/log');
const config = require('./src/config')();
const MAX_MESSAGE_LENGTH = 4096;

let bot = null;

// 如果没有配置 token, 抛出错误并退出进程
if (!config.token) return log.err('Telegram bot token is needed!');

// 如果没有chat id, 抛出错误并退出进程
if (!config.chatID) return log.err('Telegram chat id is needed!');

// 如果没有配置域名和书籍路径，抛出错误并退出进程
if (!config.domain || !config.bookUrl) return log.err('book config error!');

// 代码执行入口
async function init() {
  try {
    const result = await story({ domain: config.domain, bookUrl: config.bookUrl })
    if (result === null) return;

    let { title, content } = result;
    if (!content) return log.std(`Chapter: ${title} can't get content!`);
    if (store.has(title)) return log.std(`Chapter: ${title} already existed!`);

    if (!bot) bot = require('./src/bot')(config);
    while (content.length > MAX_MESSAGE_LENGTH) {
      await bot.telegram.sendMessage(config.chatID, content.slice(0, 4096));
      content = content.slice(MAX_MESSAGE_LENGTH, content.length)
    }
    if (content) await bot.telegram.sendMessage(config.chatID, content);
    bot.stop(() => bot = null);

    store.add(title);
  } catch (err) {
    if (bot) bot.stop(() => bot = null);
    log.err(err && (err.message || err));
  }
}

// 初始化时首次运行
init()
  .then(() => {
    // 开启定时任务，定时运行抓取任务
    schedule.scheduleJob(config.job, () => init());

    log.std('Boot success!');
  })
