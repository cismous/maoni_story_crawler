const story = require('./src/story');
const Bot = require('./src/bot');
const store = require('./src/store');
const log = require('./src/log');
const config = require('./src/config')();

function tokenError() {
  log.err('Telegram bot token is needed!');
}

if (!config.token || !config.chatID) return tokenError();
if (!config.chatID) return log.err('Telegram chat id is needed!');
const bot = Bot(config.token);
if (!config.domain || !config.bookUrl) return log.err('book config error!');

story({ domain: config.domain, bookUrl: config.bookUrl }).then(result => {
  if (result === null) return

  const { title, content } = result;
  if (store.has(title)) return log.std(`Chapter: ${title} already existed!`);
  bot.telegram.sendMessage(config.chatID, content);
  store.add(title);
});
