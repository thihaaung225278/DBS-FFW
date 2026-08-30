import * as React from 'react';
import styles from './Ffw2023.module.scss';
import type { IFfw2023Props } from './IFfw2023Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { useFfw2023Data } from '../hooks/useFfw2023Data';
import { MobileNav } from './sections/MobileNav';
import { LottieLayer } from './sections/LottieLayer';
import { PageBanner } from './sections/PageBanner';
import { AboutSection } from './sections/AboutSection';
import { HighlightsSection } from './sections/HighlightsSection';
import { ParticipantsSection } from './sections/ParticipantsSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { GameShowWinnersSection } from './sections/GameShowWinnersSection';
import { LuckyDrawSection, FooterSection } from './sections/LuckyDrawAndFooter';
import { GallerySection } from './sections/GallerySection';
import { VideoHighlightsSection } from './sections/VideoHighlightsSection';

const Ffw2023: React.FC<IFfw2023Props> = (props) => {
  const { classicYear, classicPage, galleryDownloadUrl, icalBaseUrl, onHostLayout } = props;

  const {
    data,
    participantCountry,
    setParticipantCountry,
    scheduleCountry,
    setScheduleCountry,
    winnerCountry,
    setWinnerCountry,
    videoCountry,
    setVideoCountry,
    showPostEvent
  } = useFfw2023Data();

  React.useLayoutEffect(() => {
    onHostLayout?.();
  }, [showPostEvent, onHostLayout]);

  const participants =
    data.participants?.participants[participantCountry] || null;

  const scheduleEvents = data.events?.[scheduleCountry] || null;
  const videoEvents = data.events?.[videoCountry] || null;
  const countryWinners = data.winners?.[winnerCountry] || null;

  return (
    <div
      className={styles.ffw2023Root}
      data-classic-year={escape(classicYear)}
      data-classic-page={escape(classicPage)}
    >
      <MobileNav showPostEvent={showPostEvent} />
      <LottieLayer onReady={onHostLayout} />
      <PageBanner showPostEvent={showPostEvent} />

      <div
        className="pre-during-event-sec"
        style={{ display: showPostEvent ? 'none' : undefined }}
      >
        <AboutSection />
        <HighlightsSection />
        <ParticipantsSection
          country={participantCountry}
          onCountryChange={setParticipantCountry}
          participants={participants}
        />
        <ScheduleSection
          country={scheduleCountry}
          onCountryChange={setScheduleCountry}
          countryEvents={scheduleEvents}
          icalBaseUrl={icalBaseUrl}
        />
      </div>

      <div
        className="post-event-sec"
        style={{ display: showPostEvent ? undefined : 'none' }}
      >
        <AboutSection sectionId="post-about" postEvent />
        <GameShowWinnersSection
          country={winnerCountry}
          onCountryChange={setWinnerCountry}
          winners={countryWinners}
        />
        <LuckyDrawSection />
        <GallerySection galleryDownloadUrl={galleryDownloadUrl} />
        <VideoHighlightsSection
          country={videoCountry}
          onCountryChange={setVideoCountry}
          countryEvents={videoEvents}
          showPostEvent={showPostEvent}
        />
      </div>

      <FooterSection />
    </div>
  );
};

export default Ffw2023;
