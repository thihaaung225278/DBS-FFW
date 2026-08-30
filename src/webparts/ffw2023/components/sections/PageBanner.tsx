import * as React from 'react';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';
import { scrollToClassicAnchor } from '../../../../shared/ffw2023/scrollToClassicAnchor';

const BANNER_LINKS = [
  { href: '#post-about', label: 'About' },
  { href: '#game_show_winners', label: 'Game show Winners' },
  { href: '#lucky_draw_winner', label: 'Lucky Draw Winners' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#video_highlights', label: 'Video Highlights' }
];

export interface IPageBannerProps {
  showPostEvent: boolean;
}

export const PageBanner: React.FC<IPageBannerProps> = ({ showPostEvent }) => {
  React.useEffect(() => {
    const overlay = document.getElementById('overlay-bg');
    if (!overlay) {
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const onScroll = (): void => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const opacity = 1 - scrollTop / 200;
      overlay.style.opacity = opacity >= 0.2 ? '0.2' : String(opacity);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      overlay.style.removeProperty('opacity');
    };
  }, []);

  const handleAnchorClick = (href: string, e: React.MouseEvent): void => {
    e.preventDefault();
    scrollToClassicAnchor(href);
  };

  return (
    <header className="page-banner">
      <img
        src={resolveFfw2023Image('public/images/Brand Badge_DBS-Left_E_RGB.png')}
        className="badge-logo uk-position-absolute"
        alt=""
        aria-hidden="true"
      />
      <div
        className="overlay-bg"
        id="overlay-bg"
        style={{
          backgroundImage: `url('${resolveFfw2023Image('public/images/duotone-stripe.png')}')`
        }}
      />
      <div className="uk-container">
        <div className="header-content">
          <div className="image">
            <img
              src={resolveFfw2023Image('public/images/banner-text.png')}
              alt="FutureForward Week"
            />
          </div>
          <p className="date">19 - 21 July 2023</p>
          <p className="description">Take the first step and invest in the Best of Me</p>
          <div
            className="menu post-event"
            style={{ display: showPostEvent ? undefined : 'none' }}
          >
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
