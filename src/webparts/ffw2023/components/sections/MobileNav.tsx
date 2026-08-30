import * as React from 'react';
import { scrollToClassicAnchor } from '../../../../shared/ffw2023/scrollToClassicAnchor';

const POST_EVENT_LINKS = [
  { href: '#post-about', label: 'About' },
  { href: '#game_show_winners', label: 'Game show Winners' },
  { href: '#lucky_draw_winner', label: 'Lucky Draw Winners' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#video_highlights', label: 'Video Highlights' }
];

export interface IMobileNavProps {
  showPostEvent: boolean;
}

export const MobileNav: React.FC<IMobileNavProps> = ({ showPostEvent }) => {
  const [open, setOpen] = React.useState(false);

  if (!showPostEvent) {
    return null;
  }

  const handleNavClick = (href: string, e: React.MouseEvent): void => {
    e.preventDefault();
    scrollToClassicAnchor(href);
    setOpen(false);
  };

  return (
    <div className={`navbar post-event uk-hidden@m ${open ? 'menu-open' : ''}`}>
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
        {POST_EVENT_LINKS.map((link) => (
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
