import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
export { routeMeta, renderSeoHead } from './config/seo';

export function render(path: string) {
  return renderToString(<StrictMode><StaticRouter location={path}><App /></StaticRouter></StrictMode>);
}
