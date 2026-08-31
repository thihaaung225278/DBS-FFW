import * as React from 'react';
import { resolveFfw2024Image } from '../../assets/ffw2024AssetMap';
import { isSafeHttpUrl } from '../../services/ffw2024EventHelpers';

export interface IGallerySectionProps {
  galleryViewMoreUrl: string;
}

export const GallerySection: React.FC<IGallerySectionProps> = ({ galleryViewMoreUrl }) => {
  const gifSrc = resolveFfw2024Image('public/images/2024/LF Carnival gif carousel x2.gif');
  const showLink = isSafeHttpUrl(galleryViewMoreUrl);

  return (
    <section id="gallery">
      <div className="uk-container main-container">
        <h2 className="main-title">Gallery</h2>
        <div className="card-wrap gallery-card-wrap">
          <img src={gifSrc} alt="Live Fulfilled Carnival 2024 gallery" />
          {showLink ? (
            <div className="gallery-link">
              <a href={galleryViewMoreUrl} target="_blank" rel="noopener noreferrer">
                View more photos here
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
