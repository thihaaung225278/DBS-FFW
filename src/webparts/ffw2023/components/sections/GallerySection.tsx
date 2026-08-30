import * as React from 'react';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';
import { ClassicSwiper } from '../ClassicSwiper';

const GALLERY_IMAGES = [
  'public/images/gallery/China FFW 5 - Running.jpg',
  'public/images/gallery/FFW19_072.jpg',
  'public/images/gallery/FFW19_299.jpg',
  'public/images/gallery/Hong Kong FFW 5.jpg',
  'public/images/gallery/India FFW 7.jpg',
  'public/images/gallery/Indo FFW 1.jpg'
];

export interface IGallerySectionProps {
  galleryDownloadUrl: string;
}

export const GallerySection: React.FC<IGallerySectionProps> = ({
  galleryDownloadUrl
}) => (
  <section id="gallery">
    <div className="uk-container">
      <h2 className="main-title"> Gallery </h2>
      <div className="card-wrap">
        <p style={{ paddingBottom: '40px' }}>
          Missed the event? Check out some of our favourite moments at FutureForward Week
        </p>
        <div className="gallery-wrapper">
          <ClassicSwiper
            variant="gallery"
            contentClassName="gallery"
            slides={GALLERY_IMAGES.map((image) => ({
              key: image,
              backgroundImage: resolveFfw2023Image(image),
              ariaLabel: 'Gallery photo'
            }))}
          />
        </div>
        {galleryDownloadUrl ? (
          <div className="download-all-btn">
            <a href={galleryDownloadUrl} target="_blank" rel="noreferrer">
              Download All
            </a>
          </div>
        ) : null}
      </div>
    </div>
  </section>
);
