// index.js

const puppeteer = require('puppeteer');
const list = require('./list');

/*(async() => {
  const browser = await puppeteer.launch();
  console.log(await browser.version());
  const page = await browser.newPage();

  list.forEach(async element => {
    await page.goto('http://www.deeplearningbook.org/' + element.href, {waitUntil: 'networkidle2'});
    await page.pdf({path: element.name + '.pdf', format: 'A4'});
  });

  browser.close();
})();*/

/* \puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  // other actions...
  await browser.close();
});\ */

function pullRecursive(page, array, cb) {
  const element = array.shift();
  page.goto('http://www.deeplearningbook.org/' + element.href, {waitUntil: 'networkidle2'}).then(response => {
    console.log('response: ', response.url);
    page.pdf({path: './PDFs/' + element.title + '.pdf', format: 'A4'}).then(buffer => {
      console.log('Page dumped: ', element.href, element.title);
      if (array.length > 0) {
        pullRecursive(page, array, cb);
      } else {
        console.log('recursion abgeschlossen');
        cb();
      }
    });
  });
}

puppeteer.launch().then(browser => {
  browser.version().then(string => {
    console.log(string);
    browser.newPage().then(page => {
      pullRecursive(page, list, () => {
        console.log('Closing the browser');
        browser.close();
      });
    });
  });
});