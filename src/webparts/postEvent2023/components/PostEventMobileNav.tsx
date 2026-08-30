import * as React from 'react';
import { scrollToClassicAnchor } from '../../../shared/ffw2023/scrollToClassicAnchor';
import { POST_EVENT_NAV_LINKS } from '../navLinks';

export const PostEventMobileNav: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleNavClick = (href: string, e: React.MouseEvent): void => {
    if (scrollToClassicAnchor(href)) {
      e.preventDefault();
    }

    setOpen(false);
  };

  return (
    <div className={`navbar uk-hidden@m ${open ? 'menu-open' : ''}`}>
      <div
        className={`menu-icon ${open ? 'show-menu' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
      >
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      <ul className="page-menu">
        {POST_EVENT_NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={(e) => handleNavClick(link.href, e)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
