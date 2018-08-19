const puppeteer = require('puppeteer');

module.exports = ({ domain, bookUrl }) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      handleSIGINT: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.42 Safari/537.36')
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(domain + bookUrl, { waitUntil: 'networkidle0' });

    const bookHtml = await page.evaluate(() => document.body.innerHTML);
    const list = bookHtml.match(/<a .*?">(.*?)<\/a>/g);

    const data = [];
    list.map(val => {
      const item = {};
      if ((match = /href="(.*?)"/g.exec(val))) {
        item.href = match[1];
        if (item.href.startsWith(bookUrl)) {
          item.title = val.replace(/<a .*">|<\/a>/g, '');
          if (item.title.startsWith('第')) data.push(item);
        }
      }
    });

    const latest = data[0];
    if (!latest) {
      await browser.close();
      return reject(null);
    }

    await page.goto(domain + latest.href, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#content');
    const content = await page.evaluate(() => {
      const el = document.querySelector('#content')
      if (el) return el.textContent;
      return null
    });
    if (content) resolve({ ...latest, content })
    else reject(null);
    await browser.close();
  });
};
