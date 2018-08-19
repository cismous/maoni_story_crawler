const story = require('./src/story');
const store = require('./src/store');
const log = require('./src/log');
const config = require('./src/config')();

if (!config.token) return log.err('Telegram bot token is needed!');
if (!config.chatID) return log.err('Telegram chat id is needed!');
const bot = require('./src/bot')(config.token);

if (!config.domain || !config.bookUrl) return log.err('book config error!');
story({ domain: config.domain, bookUrl: config.bookUrl }).then(result => {
  if (result === null) return;

  const { title, content } = result;
  if (store.has(title)) return log.std(`Chapter: ${title} already existed!`);
  bot.telegram.sendMessage(config.chatID, content);
  store.add(title);
});
