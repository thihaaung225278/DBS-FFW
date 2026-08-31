import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { SCHEDULE_COUNTRIES } from '../countries';
import type { ICountryEvents } from '../../services/ffw2025Types';
import {
  formatSpeakerLine,
  getLocalDateFormatted,
  groupScheduleEvents,
  isEventPast,
  isSafeHttpUrl,
  renderScheduleContent
} from '../../services/ffw2025EventHelpers';

export interface IScheduleSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  countryEvents: ICountryEvents | undefined;
}

export const ScheduleSection: React.FC<IScheduleSectionProps> = ({
  country,
  onCountryChange,
  countryEvents
}) => {
  const today = getLocalDateFormatted();
  const events = countryEvents?.events || [];
  const grouped = groupScheduleEvents(events);

  return (
    <section id="schedule">
      <div className="uk-container main-container">
        <h2 className="main-title schedule-title">Schedule</h2>
        <div className="schedule-header-container">
          <h2 className="whathp-title">What&apos;s Happening in</h2>
          <CountryDropdown
            id="schedule-dd"
            options={SCHEDULE_COUNTRIES}
            selectedValue={country}
            onChange={onCountryChange}
          />
        </div>
        <div className="tabs-container">
          <div className="tab-content">
            {grouped.map((item, index) => {
              const speakerLine = formatSpeakerLine(item.speaker, item.designation);
              const past = isEventPast(item.date, today);
              const watchUrl = past && isSafeHttpUrl(item.video_link) ? item.video_link : '';
              const timeLabel = item.time_start
                ? `${item.time_start} - ${item.time_end}${item.timezone ? ` ${item.timezone}` : ''}`
                : '';

              return (
                <div className="tab-pane" key={`${item.title}-${index}`}>
                  <div className={`contents uk-flex${past ? ' check-past' : ''}`}>
                    <div className="left-content">
                      <div>
                        <p className="ev-date">{item.formattedDateRange}</p>
                        {timeLabel ? <p className="ev-time">{timeLabel}</p> : null}
                      </div>
                      <div>
                        {item.location ? <p className="ev-location">{item.location}</p> : null}
                      </div>
                    </div>
                    <div className="center-content">
                      <div className="title">
                        <p>{item.title}</p>
                      </div>
                      <div className="people">
                        {speakerLine ? <p className="speaker">{speakerLine}</p> : null}
                        {item.moderator.length ? (
                          <p className="moderator"> Moderated by  {item.moderator.join(' and ')}  </p>
                        ) : null}
                      </div>
                      <p className="mobile-ev-date">{item.formattedDateRange}</p>
                      {timeLabel ? <p className="mobile-time">{timeLabel}</p> : null}
                      {item.location ? <p className="mobile-location">{item.location}</p> : null}
                      <p className="desc">{renderScheduleContent(item.content)}</p>
                      {item.footnote ? <p className="footnote">{item.footnote}</p> : null}
                    </div>
                    <div className="right-content">
                      {watchUrl ? (
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="uk-flex"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <p className="play-icon">
                            Watch
                            <br />
                            playback
                          </p>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
