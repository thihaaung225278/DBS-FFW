import * as React from 'react';
import styles from './Ffw2024.module.scss';
import type { IFfw2024Props } from './IFfw2024Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { Ffw2024DataService } from '../services/ffw2024DataService';
import { PageBanner } from './sections/PageBanner';
import { AboutSection } from './sections/AboutSection';
import { HighlightsSection } from './sections/HighlightsSection';
import { GallerySection } from './sections/GallerySection';
import { VideoPlaybacksSection } from './sections/VideoPlaybacksSection';

const Ffw2024: React.FC<IFfw2024Props> = (props) => {
  const { classicYear, classicPage, galleryViewMoreUrl, onHostLayout } = props;
  const loaded = React.useMemo(() => new Ffw2024DataService().loadAll(), []);
  const [playbackCountry, setPlaybackCountry] = React.useState('sg');

  React.useLayoutEffect(() => {
    onHostLayout?.();
  }, [onHostLayout, playbackCountry]);

  const countryEvents = loaded.events?.[playbackCountry];

  return (
    <div
      className={styles.ffw2024Root}
      data-classic-year={escape(classicYear)}
      data-classic-page={escape(classicPage)}
    >
      <div className="video-playbacks">
      <div className="banner-image" />
      <PageBanner />
      <div className="pre-during-event-sec">
        <AboutSection />
        <HighlightsSection />
        <GallerySection galleryViewMoreUrl={galleryViewMoreUrl} />
        <VideoPlaybacksSection
          country={playbackCountry}
          onCountryChange={setPlaybackCountry}
          countryEvents={countryEvents}
        />
      </div>
      </div>
    </div>
  );
};

export default Ffw2024;
