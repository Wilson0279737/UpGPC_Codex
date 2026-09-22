import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSeo } from '../config/seo';

const SeoManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const { title, tags, canonical, schema } = getPageSeo(pathname);
    document.title = title;
    for (const tag of tags) {
      const key = 'name' in tag ? 'name' : 'property';
      const value = 'name' in tag ? tag.name! : tag.property!;
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(key, value);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    }
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    } else {
      link?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
    let structuredData = document.head.querySelector<HTMLScriptElement>('script[data-seo="local-business"]');
    if (schema) {
      if (!structuredData) {
        structuredData = document.createElement('script');
        structuredData.type = 'application/ld+json';
        structuredData.dataset.seo = 'local-business';
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify(schema);
    } else {
      structuredData?.remove();
    }
  }, [pathname]);
  return null;
};

export default SeoManager;
