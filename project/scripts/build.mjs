import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
await build({ root });
await build({ root, build: { ssr: 'src/entry-server.tsx', outDir: '.prerender', copyPublicDir: false } });
const { render, renderSeoHead, routeMeta } = await import(pathToFileURL(path.join(root, '.prerender/entry-server.js')).href);
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
for (const route of [...Object.keys(routeMeta), '/404']) {
  const target = route === '/404' ? '404.html' : route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
  const output = path.join(root, 'dist', target);
  const html = template.replace('<!--page-head-->', () => renderSeoHead(route))
    .replace('<div id="root"></div>', () => `<div id="root">${render(route)}</div>`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}
console.log('Prerendered five pages and a 404 using the existing React components.');
