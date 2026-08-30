import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { VIDEO_HIGHLIGHT_COUNTRIES } from '../countries';
import { formatSpeakerLine, groupEventsByDate } from '../../services/ffw2023EventHelpers';
import { formatTabDate, isAfterEventEnd } from '../../../../shared/ffw2023/dateHelpers';
import type { ICountryEvents } from '../../services/ffw2023Types';

export interface IVideoHighlightsSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  countryEvents: ICountryEvents | null;
  showPostEvent: boolean;
}

export const VideoHighlightsSection: React.FC<IVideoHighlightsSectionProps> = ({
  country,
  onCountryChange,
  countryEvents,
  showPostEvent
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const grouped = countryEvents ? groupEventsByDate(countryEvents.events) : {};
  const dates = Object.keys(grouped);

  React.useEffect(() => {
    setActiveTab(0);
  }, [country]);

  if (!showPostEvent || !countryEvents) {
    return null;
  }

  const eventEnded = isAfterEventEnd(
    new Date().toISOString().slice(0, 10),
    countryEvents['event-end-date']
  );

  if (!eventEnded) {
    return null;
  }

  return (
    <section id="video_highlights">
      <div className="uk-container">
        <h2 className="main-title">Video highlights</h2>
        <div className="tabs-container">
          <p className="text-intro uk-text-center">
            The timings below are based on <span>Singapore</span> timezone.
          </p>
          <div className="video-highlight-tab">
            <div>
              <div className="tab-menu uk-flex uk-flex-between">
                <ul className="past-event-tab">
                  {dates.map((date, index) => {
                    const { formatted } = formatTabDate(date);
                    return (
                      <li
                        key={date}
                        className={index === activeTab ? 'active' : undefined}
                        onClick={() => setActiveTab(index)}
                        role="tab"
                        tabIndex={0}
                      >
                        {formatted}
                        <span>(Day {index + 1})</span>
                      </li>
                    );
                  })}
                </ul>
                <CountryDropdown
                  id="video-highlight-dd"
                  options={VIDEO_HIGHLIGHT_COUNTRIES}
                  selectedValue={country}
                  onChange={onCountryChange}
                />
              </div>
              <div className="past-event-tab-content">
                {dates.map((date, index) => {
                  const { formatted } = formatTabDate(date);
                  const events = grouped[date].filter((e) => e.video_link);

                  return (
                    <div
                      key={date}
                      className={`tab-pane ${index === activeTab ? 'active' : ''}`}
                    >
                      <p className="mobile-eDate">
                        {formatted} <span>(Day {index + 1})</span>
                      </p>
                      {events.map((event) => (
                        <div key={event.title} className="contents uk-flex">
                          <div className="center-content">
                            <p className="title">{event.title}</p>
                            {event.speaker?.length ? (
                              <p className="speaker">
                                {formatSpeakerLine(event.speaker, event.designation || [])}
                              </p>
                            ) : null}
                            {event.moderator?.length ? (
                              <p className="moderator">
                                Moderated by {event.moderator.join(' and ')}
                              </p>
                            ) : null}
                            <p className="mobile-time">
                              {event.time_start} - {event.time_end}
                            </p>
                            {event.content ? (
                              <p
                                className="desc"
                                dangerouslySetInnerHTML={{ __html: event.content }}
                              />
                            ) : null}
                          </div>
                          <div className="right-content">
                            <a
                              href={event.video_link}
                              target="_blank"
                              rel="noreferrer"
                              className="uk-flex"
                            >
                              <p className="btn_playback">
                                Watch
                                <br />
                                playback
                              </p>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
