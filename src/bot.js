// 机器人，发送文章内容到 telegram 机器人

const Telegram = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent');
const log = require('./log');

module.exports = (data) => {
  const opts = {}
  if (data.proxyHost && data.proxyPort) {
    opts.telegram = {
      agent: new SocksAgent({
        socksHost: data.proxyHost,
        socksPort: data.proxyPort,
      }),
    };
  }
  const bot = new Telegram(data.token, opts);

  bot.startPolling();
  bot.catch(err => log.err(err));

  return bot;
};
