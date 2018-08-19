// init temp, store has crawler chapter.

const path = require('path');
const fs = require('fs');
const log = require('./log');
const storeFilePath = path.join(__dirname, '../local.bat');
const splitStr = ',,,,,';
const list = [];

try {
  const content = fs.readFileSync(storeFilePath)
  content.toString().split('\n').map(chapter => {
    const result = chapter.split(splitStr);
    if (result.length === 2)
      list.push({
        ts: Number(result[0]),
        title: result[1],
      });
  });
} catch (err) {
}

const data = {
  has(chapter) {
    return !!list.find(item => item.title === chapter);
  },
  add(chapter) {
    const now = Date.now();
    fs.appendFileSync(storeFilePath, now + splitStr + chapter + '\n');
    list.unshift({ ts: now, title: chapter });
    log.std(`Chapter: ${chapter} fetch success!`);
  },
  get list() {
    return list;
  },
};

module.exports = data;
