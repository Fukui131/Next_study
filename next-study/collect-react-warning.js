const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => {
    console.log('CONSOLE[' + msg.type() + ']:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGEERROR:', err.stack || err.message);
  });
  page.on('requestfailed', req => {
    console.log('REQFAILED:', req.url(), req.failure()?.errorText);
  });
  try {
    await page.goto('http://127.0.0.1:3000/tasks', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(8000);
    console.log('PAGE TITLE:', await page.title());
  } catch (err) {
    console.error('NAV ERROR:', err.stack || err.message);
  } finally {
    await browser.close();
  }
})();
