import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buttonBaseClass, buttonSizeClasses, buttonToneClasses } from './siteStyles';

type ActionLinkProps = {
  children: ReactNode;
  className?: string;
  external?: boolean;
  href?: string;
  size?: keyof typeof buttonSizeClasses;
  to?: string;
  variant?: keyof typeof buttonToneClasses;
};

const ActionLink = ({
  children,
  className = '',
  external = false,
  href,
  size = 'md',
  to,
  variant = 'primary',
}: ActionLinkProps) => {
  const classes = `${buttonBaseClass} ${buttonSizeClasses[size]} ${buttonToneClasses[variant]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (!href) {
    throw new Error('ActionLink requires either "to" or "href".');
  }

  return (
    <a
      href={href}
      className={classes}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

export default ActionLink;
