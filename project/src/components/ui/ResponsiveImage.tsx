import type { ImgHTMLAttributes } from 'react';
import { optimizedImages } from '../../config/images';

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

const ResponsiveImage = ({ src, alt, sizes = '100vw', fetchPriority, ...props }: Props) => {
  const image = optimizedImages[src];
  // React 18 accepts the standard lowercase attribute without an unknown-prop warning.
  const priority = fetchPriority ? { fetchpriority: fetchPriority } : {};
  return <img {...image} {...props} {...priority} src={image?.src ?? src} alt={alt} sizes={image ? sizes : undefined} />;
};

export default ResponsiveImage;
