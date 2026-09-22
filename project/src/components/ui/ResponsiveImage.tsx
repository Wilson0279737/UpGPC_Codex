import type { ImgHTMLAttributes } from 'react';
import { optimizedImages } from '../../config/images';

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

const ResponsiveImage = ({ src, alt, sizes = '100vw', ...props }: Props) => {
  const image = optimizedImages[src];
  return <img {...image} {...props} src={image?.src ?? src} alt={alt} sizes={image ? sizes : undefined} />;
};

export default ResponsiveImage;
