var puppeteer = require('puppeteer');

var url =
  'https://jhollingworth.github.io/swiftshader-transparent-image/index.html';

var headless = process.argv.indexOf('--headless=true') !== -1;

puppeteer
  .launch({
    headless: headless,
    args: ['--disable-gpu']
  })
  .then(browser => {
    return browser.newPage().then(page => {
      return page
        .goto(url)
        .then(() => page.waitFor(1000))
        .then(() =>
          page.screenshot({
            path: headless ? 'headless.png' : 'xvfb.png',
            clip: {
              x: 0,
              y: 0,
              width: 1300,
              height: 1300
            }
          })
        )
        .then(() => browser.close());
    });
  });
