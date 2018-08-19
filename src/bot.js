// 机器人，发送文章内容到 telegram 机器人

const Telegram = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent');
const socksAgent = new SocksAgent({
  socksHost: '127.0.0.1',
  socksPort: 1080,
});

module.exports = token => {
  const bot = new Telegram(token, { telegram: { agent: socksAgent } })

  bot.startPolling();

  return bot;
};
