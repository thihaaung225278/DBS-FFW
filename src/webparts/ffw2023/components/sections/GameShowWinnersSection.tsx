import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { WINNER_COUNTRIES } from '../countries';
import { countryHasWinnerData } from '../../services/ffw2023EventHelpers';
import type { ICountryWinners, IWinnerFinal, IWinnerSemiFinal } from '../../services/ffw2023Types';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';
import { ClassicSwiper } from '../ClassicSwiper';

const DEFAULT_SLIDES = [
  'public/images/gameshow/SG_NEW.jpg',
  'public/images/gameshow/RKL_0416.jpg',
  'public/images/gameshow/CN.png',
  'public/images/gameshow/TW.JPG',
  'public/images/gameshow/ID.png'
];

export interface IGameShowWinnersSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  winners: ICountryWinners | null;
}

export const GameShowWinnersSection: React.FC<IGameShowWinnersSectionProps> = ({
  country,
  onCountryChange,
  winners
}) => {
  const hasData = countryHasWinnerData(winners || undefined);
  const finals = (winners?.final || []) as IWinnerFinal[];
  const semiFinals = (winners?.semi_final || []) as IWinnerSemiFinal[];

  return (
    <section id="game_show_winners">
      <div className="uk-container">
        <h2 className="main-title"> Game show winners </h2>
        <p className="main-sub-title">
          Check out who are the winners from our game show &ldquo;Who wants to Live Fulfilled&rdquo; -
          Did You Know Edition, and find out if you&apos;re a Lucky Draw winner below!
        </p>
        {!hasData ? (
          <p className="uk-text-center no-data-message">There is no data.</p>
        ) : (
          <div className="card-wrap">
            <ClassicSwiper
              variant="winner"
              contentClassName="team-photo"
              slides={DEFAULT_SLIDES.map((slide) => ({
                key: slide,
                backgroundImage: resolveFfw2023Image(slide),
                ariaLabel: 'Game show winners photo'
              }))}
            />
            <CountryDropdown
              id="select_country"
              options={WINNER_COUNTRIES}
              selectedValue={country}
              onChange={onCountryChange}
            />
            <div className="card-content">
              <div className="winner-listing uk-grid">
                {finals.map((winner) => (
                  <div key={winner.team_name + winner.prize} className="uk-width-1-1 uk-width-1-2@m">
                    <div className="list">
                      <h3
                        className="winner-title"
                        dangerouslySetInnerHTML={{ __html: winner.prize }}
                      />
                      <p className="prize-item">{winner.prize_item}</p>
                      <div className="team-name">{winner.team_name}</div>
                      <ul className="team-members">
                        {winner.results.map((member) => (
                          <li key={member}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              {semiFinals.length > 0 ? (
                <div className="semi-final">
                  <h3 className="winner-title">Semi-finalists</h3>
                  <h5 className="prize-item">600 iTQ points each</h5>
                  <div className="semi-final-listing uk-grid">
                    {semiFinals.map((sf) => (
                      <div
                        key={sf.team_name}
                        className="list-wrap uk-width-1-1 uk-width-1-2@s uk-width-1-3@m uk-width-1-4@l"
                      >
                        <div className="list">
                          <p className="team-name">{sf.team_name}</p>
                          <ul className="team-members">
                            {sf.results.map((member) => (
                              <li key={member}>{member}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
