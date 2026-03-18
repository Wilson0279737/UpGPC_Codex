import type { ReactNode } from 'react';
import { sectionDescriptionClass, sectionEyebrowClass, sectionTitleClass } from './siteStyles';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
  children?: ReactNode;
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'left',
  as = 'h2',
  className = '',
  children,
}: SectionHeaderProps) => {
  const TitleTag = as;
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} reveal ${className}`.trim()}>
      <div className={`${sectionEyebrowClass} ${centered ? 'mx-auto' : ''}`.trim()}>{eyebrow}</div>
      <TitleTag className={`mt-5 ${sectionTitleClass}`}>{title}</TitleTag>
      <p className={`mt-4 ${sectionDescriptionClass}`}>{description}</p>
      {children && (
        <div className={`mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${centered ? 'justify-center' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
