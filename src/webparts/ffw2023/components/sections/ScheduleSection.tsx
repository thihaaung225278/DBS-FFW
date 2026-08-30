import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { SCHEDULE_COUNTRIES } from '../countries';
import { formatTabDate } from '../../../../shared/ffw2023/dateHelpers';
import { formatSpeakerLine, groupEventsByDate } from '../../services/ffw2023EventHelpers';
import type { ICountryEvents } from '../../services/ffw2023Types';
import { resolveFfw2023Asset } from '../../assets/ffw2023AssetMap';

export interface IScheduleSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  countryEvents: ICountryEvents | null;
}

export const ScheduleSection: React.FC<IScheduleSectionProps> = ({
  country,
  onCountryChange,
  countryEvents
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const grouped = countryEvents ? groupEventsByDate(countryEvents.events) : {};
  const dates = Object.keys(grouped);

  React.useEffect(() => {
    setActiveTab(0);
  }, [country]);

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
                    onClick={() => setActiveTab(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab(index);
                      }
                    }}
                    role="tab"
                    tabIndex={0}
                    aria-selected={index === activeTab}
                  >
                    {formatted}
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
          <div className="tab-content">
            {dates.map((date, index) => {
              const events = grouped[date];
              return (
                <div
                  key={date}
                  className={`tab-pane ${index === activeTab ? 'active' : ''}`}
                  role="tabpanel"
                  hidden={index !== activeTab}
                >
                  {events.map((event) => (
                    <div key={event.title + event.time_start} className="schedule-card uk-flex">
                      <div className="left-content">
                        <p className="time">
                          {event.time_start} - {event.time_end}
                        </p>
                        <p className="title">{event.title}</p>
                        {event.speaker ? (
                          <p className="speaker">
                            {formatSpeakerLine(event.speaker, event.designation || [])}
                          </p>
                        ) : null}
                        {event.moderator && event.moderator.length ? (
                          <p className="moderator">Moderated by {event.moderator.join(' and ')}</p>
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
                            href={resolveFfw2023Asset(event.icl_link)}
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
                        {event.video_link ? (
                          <a href={event.video_link} target="_blank" rel="noreferrer" className="uk-flex">
                            <p className="btn_playback">
                              Watch
                              <br />
                              playback
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
