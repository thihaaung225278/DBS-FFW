import * as React from 'react';
import styles from './Ffw2025.module.scss';
import type { IFfw2025Props } from './IFfw2025Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { Ffw2025DataService } from '../services/ffw2025DataService';
import { PageBanner } from './sections/PageBanner';
import { AboutSection } from './sections/AboutSection';
import { HighlightsSection } from './sections/HighlightsSection';
import { GallerySection } from './sections/GallerySection';
import { ScheduleSection } from './sections/ScheduleSection';

const Ffw2025: React.FC<IFfw2025Props> = (props) => {
  const { classicYear, classicPage, galleryViewMoreUrl, onHostLayout } = props;
  const loaded = React.useMemo(() => new Ffw2025DataService().loadAll(), []);
  const [scheduleCountry, setScheduleCountry] = React.useState('sg');

  React.useLayoutEffect(() => {
    onHostLayout?.();
  }, [onHostLayout, scheduleCountry]);

  const countryEvents = loaded.events?.[scheduleCountry];

  return (
    <div
      className={styles.ffw2025Root}
      data-classic-year={escape(classicYear)}
      data-classic-page={escape(classicPage)}
    >
      <PageBanner />
      <div className="pre-during-event-sec">
        <AboutSection />
        <HighlightsSection />
        <GallerySection galleryViewMoreUrl={galleryViewMoreUrl} />
        <ScheduleSection
          country={scheduleCountry}
          onCountryChange={setScheduleCountry}
          countryEvents={countryEvents}
        />
      </div>
    </div>
  );
};

export default Ffw2025;
