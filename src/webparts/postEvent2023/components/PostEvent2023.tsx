import * as React from 'react';
import styles from './PostEvent2023.module.scss';
import ffwStyles from '../../ffw2023/components/Ffw2023.module.scss';
import type { IPostEvent2023Props } from './IPostEvent2023Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { Ffw2023DataService } from '../../ffw2023/services/ffw2023DataService';
import { LottieLayer } from '../../ffw2023/components/sections/LottieLayer';
import { AboutSection } from '../../ffw2023/components/sections/AboutSection';
import { FooterSection } from '../../ffw2023/components/sections/LuckyDrawAndFooter';
import { PostEventMobileNav } from './PostEventMobileNav';
import { PostEventPageBanner } from './PostEventPageBanner';
import { PostEventHighlights } from './PostEventHighlights';
import { PostEventSchedule } from './PostEventSchedule';
import { PostEventGameShowWinners } from './PostEventGameShowWinners';
import { PostEventLuckyDrawChrome } from './PostEventLuckyDrawChrome';

const PostEvent2023: React.FC<IPostEvent2023Props> = (props) => {
  const { classicYear, classicPage, icalBaseUrl, onHostLayout } = props;

  const loaded = React.useMemo(() => new Ffw2023DataService().loadAll(), []);
  const [scheduleCountry, setScheduleCountry] = React.useState('sg');
  const [winnerCountry, setWinnerCountry] = React.useState('sg');

  React.useLayoutEffect(() => {
    onHostLayout?.();
  }, [onHostLayout]);

  const scheduleEvents = loaded.data.events?.[scheduleCountry];
  const countryWinners = loaded.data.winners?.[winnerCountry];

  return (
    <div
      className={`${ffwStyles.ffw2023Root} ${styles.postEvent2023Root}`}
      data-classic-year={escape(classicYear)}
      data-classic-page={escape(classicPage)}
    >
      <PostEventMobileNav />
      <LottieLayer onReady={onHostLayout} />
      <PostEventPageBanner />
      <AboutSection />
      <PostEventHighlights />
      <PostEventSchedule
        country={scheduleCountry}
        onCountryChange={setScheduleCountry}
        countryEvents={scheduleEvents}
        icalBaseUrl={icalBaseUrl}
      />
      <PostEventGameShowWinners
        country={winnerCountry}
        onCountryChange={setWinnerCountry}
        winners={countryWinners}
      />
      <PostEventLuckyDrawChrome />
      <FooterSection />
    </div>
  );
};

export default PostEvent2023;
