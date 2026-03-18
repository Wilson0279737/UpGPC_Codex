import type { ReactNode } from 'react';
import { panelClass, windowLabelClass } from './siteStyles';

type PanelFrameProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  label?: string;
};

const PanelFrame = ({ children, className = '', innerClassName = '', label }: PanelFrameProps) => {
  return (
    <div className={`${panelClass} ${className}`.trim()}>
      <div className={`px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 ${innerClassName}`.trim()}>
        {label ? (
          <div className="mb-5 sm:mb-6">
            <span className={windowLabelClass}>{label}</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default PanelFrame;
