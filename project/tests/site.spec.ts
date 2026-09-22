import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/services', '/products', '/about', '/contact'];

for (const width of [320, 390, 768, 1440]) {
  for (const route of routes) {
    test(`${route} works at ${width}px with accessible content`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://upgradegamingpcs.com${route}`);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      });
      // Hidden decorative images intentionally remain lazy on smaller screens.
      await expect.poll(() => page.evaluate(() => [...document.images].filter(image => image.getClientRects().length > 0).every(image => image.complete && image.naturalWidth > 0))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page }).analyze();
        expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
      }
    });
  }
}

test('all routes have unique SEO, valid local schema assets, and usable content without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    titles.add(await page.title());
    descriptions.add(await page.locator('meta[name="description"]').getAttribute('content'));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://upgradegamingpcs.com${route}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://upgradegamingpcs.com${route}`);
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}');
    const business = schema['@graph'].find((item: { '@type': string }) => item['@type'] === 'ComputerStore');
    expect(business.telephone).toBe('+1-810-441-3020');
    for (const asset of [business.logo, business.image]) {
      const response = await request.get(new URL(asset).pathname);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^image\//);
    }
    const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(e => e.getAttribute('href')!))]);
    for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  }
  expect(titles.size).toBe(5);
  expect(descriptions.size).toBe(5);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(5);
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://upgradegamingpcs.com/sitemap.xml');
  await context.close();
});

test('mobile navigation hides closed links, supports Escape and focuses new page content', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Get a Free Quote' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await expect(page.getByRole('link', { name: 'View Products' })).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL('/services');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await page.goBack();
  await expect(page).toHaveURL('/#main-content');
  await expect(page.locator('h1')).toContainText('Gaming PCs');
});

test('map only loads on request and contact actions retain correct destinations', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (request.url().includes('google.com/maps/embed')) requests.push(request.url()); });
  await page.route('https://www.google.com/maps/embed?*', route => route.fulfill({ contentType: 'text/html', body: '<p>Map test response</p>' }));
  await page.goto('/contact');
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(requests).toEqual([]);
  await expect(page.getByRole('link', { name: 'Call (810) 441-3020', exact: true })).toHaveAttribute('href', 'tel:+18104413020');
  await expect(page.getByRole('link', { name: 'Email The Shop', exact: true })).toHaveAttribute('href', 'mailto:brandonwilson0279737@gmail.com');
  await page.getByRole('button', { name: 'Expand Map' }).click();
  await expect(page.getByTitle('Upgrade Gaming PCs Location')).toBeVisible();
  await expect.poll(() => requests.length).toBe(1);
  await page.getByRole('button', { name: 'Hide Map' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('unknown URLs return a real 404 with recovery links and no indexing', async ({ page, request }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
  expect((await request.get('/missing-image.jpg')).status()).toBe(404);
  for (const [from, to] of [['/pages/repair.html', '/services'], ['/pages/products.html', '/products']]) {
    const redirect = await request.get(from, { maxRedirects: 0 });
    expect(redirect.status()).toBe(301);
    expect(redirect.headers().location).toBe(to);
  }
});

test('reduced motion and incoming anchors work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contact#contact');
  await expect(page.locator('#contact')).toBeInViewport();
  const motion = await page.locator('.hero-banner, .reveal').first().evaluate(element => getComputedStyle(element).animationName);
  expect(motion).toBe('none');
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).touchAction)).toContain('pinch-zoom');
  await page.goto('/#services');
  await expect(page).toHaveURL('/services');
  await expect(page.locator('main')).toBeFocused();
});
