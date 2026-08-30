import * as React from 'react';
import { CountryDropdown } from '../../ffw2023/components/CountryDropdown';
import { SCHEDULE_COUNTRIES } from '../../ffw2023/components/countries';
import { formatSpeakerLine, groupEventsByDate } from '../../ffw2023/services/ffw2023EventHelpers';
import { formatTabDate } from '../../../shared/ffw2023/dateHelpers';
import type { ICountryEvents } from '../../ffw2023/services/ffw2023Types';
import { resolveFfw2023IcalUrl } from '../../ffw2023/utils/ffw2023SiteAssetUrls';

/** post-event.aspx has no date-gate; 2023 event-end has passed — classic checkSchedule → past */
const POST_EVENT_STATUS = 'past';

export interface IPostEventScheduleProps {
  country: string;
  onCountryChange: (value: string) => void;
  countryEvents?: ICountryEvents;
  icalBaseUrl: string;
}

export const PostEventSchedule: React.FC<IPostEventScheduleProps> = ({
  country,
  onCountryChange,
  countryEvents,
  icalBaseUrl
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const grouped = countryEvents ? groupEventsByDate(countryEvents.events) : {};
  const dates = Object.keys(grouped);

  React.useEffect(() => {
    setActiveTab(0);
  }, [country]);

  const selectTab = (index: number): void => {
    setActiveTab(index);
  };

  return (
    <section id="schedule">
      <div className="uk-container">
        <h2 className="main-title">Schedule</h2>
        <div className="tabs-container">
          <div className="tab-menu uk-flex uk-flex-between">
            <ul className="tabs">
              {dates.map((date, index) => {
                const { formatted } = formatTabDate(date);
                return (
                  <li
                    key={date}
                    className={index === activeTab ? 'active' : undefined}
                    onClick={() => selectTab(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectTab(index);
                      }
                    }}
                    role="tab"
                    tabIndex={0}
                    aria-selected={index === activeTab}
                  >
                    {formatted}
                    <span>(Day {index + 1})</span>
                  </li>
                );
              })}
            </ul>
            <CountryDropdown
              id="schedule-dd"
              options={SCHEDULE_COUNTRIES}
              selectedValue={country}
              onChange={onCountryChange}
            />
          </div>
          <p className="text-intro uk-text-center">
            The timings below are based on <span>Singapore</span> timezone.
          </p>
          <div className="tab-content">
            {dates.map((date, index) => {
              const { formatted } = formatTabDate(date);
              const events = grouped[date];

              return (
                <div
                  key={date}
                  className={`tab-pane ${index === activeTab ? 'active' : ''}`}
                  role="tabpanel"
                >
                  <p className="mobile-eDate">
                    {formatted} <span>(Day {index + 1})</span>
                  </p>
                  {events.map((event) => (
                    <div
                      key={`${event.CheckId ?? event.title}-${event.time_start}`}
                      className={`contents check-${POST_EVENT_STATUS} uk-flex`}
                    >
                      <div className="left-content">
                        <p>
                          {event.time_start} - {event.time_end}
                        </p>
                      </div>
                      <div className="center-content">
                        <div className="title">
                          <p>{event.title}</p> <span>{POST_EVENT_STATUS}</span>
                        </div>
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
                        {event.icl_link ? (
                          <a
                            href={resolveFfw2023IcalUrl(event.icl_link, icalBaseUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="uk-flex"
                            download
                          >
                            <p className="save-date">
                              Save
                              <br />
                              the date
                            </p>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
