import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { VIDEO_PLAYBACK_COUNTRIES } from '../countries';
import { resolveFfw2024Image } from '../../assets/ffw2024AssetMap';
import type { ICountryEvents, IEventItem } from '../../services/ffw2024Types';
import {
  formatSpeakerLine,
  groupPlaybackEvents,
  isSafeHttpUrl,
  renderPlaybackContent
} from '../../services/ffw2024EventHelpers';

function resolvePlaybackImage(classicSrc: string): string | undefined {
  const bundled = resolveFfw2024Image(classicSrc);
  return bundled && bundled !== classicSrc ? bundled : undefined;
}

export interface IVideoPlaybacksSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  countryEvents: ICountryEvents | undefined;
}

export const VideoPlaybacksSection: React.FC<IVideoPlaybacksSectionProps> = ({
  country,
  onCountryChange,
  countryEvents
}) => {
  const events: IEventItem[] = countryEvents?.events || [];
  const grouped = groupPlaybackEvents(events);

  return (
    <section id="video-playbacks">
      <div className="uk-container main-container">
        <h2 className="main-title">Video Playbacks In</h2>
        <CountryDropdown
          id="schedule-dd"
          options={VIDEO_PLAYBACK_COUNTRIES}
          selectedValue={country}
          onChange={onCountryChange}
        />
        <div className="tabs-container">
          <div className="tab-content">
            {grouped.map((item, index) => {
              const speakerLine = formatSpeakerLine(item.speaker, item.designation);
              const watchUrl = isSafeHttpUrl(item.video_link) ? item.video_link : '';
              const timeLabel = item.time_start
                ? `${item.time_start} - ${item.time_end}${item.timezone ? ` (${item.timezone})` : ''}`
                : '';

              return (
                <div className="tab-pane" key={`${item.title}-${index}`}>
                  <div className="contents has-video uk-flex">
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
                      <p className="desc">{renderPlaybackContent(item.content, resolvePlaybackImage)}</p>
                      {item.footnote ? <p className="footnote">{item.footnote}</p> : null}
                    </div>
                    <div className="right-content">
                      {watchUrl ? (
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="uk-flex"
                        >
                          <p className="play-icon">Watch Now</p>
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
