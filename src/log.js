// 日志记录

const dateformat = require('dateformat');
const format = 'yyyy-mm-dd HH:MM:ss';

module.exports = {
  std(msg) {
    process.stdout.write(dateformat(Date.now(), format) + ' - ' + msg + '\n');
  },

  err(msg) {
    process.stderr.write(dateformat(Date.now(), format) + ' - ' + msg + '\n');
  },
};
