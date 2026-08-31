import * as React from 'react';
import { resolveFfw2024Image } from '../../assets/ffw2024AssetMap';
import { scrollToClassicAnchor } from '../../../../shared/ffw2023/scrollToClassicAnchor';

const BANNER_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#highlight', label: 'Event Highlights' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#video-playbacks', label: 'Video Playbacks' }
];

export const PageBanner: React.FC = () => {
  const handleAnchorClick = (href: string, e: React.MouseEvent): void => {
    if (scrollToClassicAnchor(href)) {
      e.preventDefault();
    }
  };

  return (
    <header className="page-banner">
      <div className="uk-container main-container">
        <div className="header-content">
          <div className="image">
            <img
              src={resolveFfw2024Image('public/images/2024/logo.png')}
              alt="Live Fulfilled Carnival 2024"
            />
          </div>
          <p className="description">
            Bringing to life the Best of Me, We and E(nvironment)
          </p>
          <div className="menu pre-during-event">
            <ul>
              {BANNER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleAnchorClick(link.href, e)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
