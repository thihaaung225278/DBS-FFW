import * as React from 'react';
import { CountryDropdown } from '../../ffw2023/components/CountryDropdown';
import type { ICountryOption } from '../../ffw2023/components/countries';
import { countryHasWinnerData } from '../../ffw2023/services/ffw2023EventHelpers';
import type { ICountryWinners, IWinnerFinal, IWinnerSemiFinal } from '../../ffw2023/services/ffw2023Types';
import { renderPrizeTitle } from '../utils/renderPrizeTitle';

/** Classic post-event.aspx #select_country — includes empty india2. */
const POST_EVENT_WINNER_COUNTRIES: ICountryOption[] = [
  { value: 'sg', label: 'Singapore' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'cn', label: 'China' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'india', label: 'India - DBIL' },
  { value: 'india2', label: 'India - DTI' },
  { value: 'indo', label: 'Indonesia' }
];

export interface IPostEventGameShowWinnersProps {
  country: string;
  onCountryChange: (value: string) => void;
  winners: ICountryWinners | undefined;
}

export const PostEventGameShowWinners: React.FC<IPostEventGameShowWinnersProps> = ({
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
        <CountryDropdown
          id="select_country"
          options={POST_EVENT_WINNER_COUNTRIES}
          selectedValue={country}
          onChange={onCountryChange}
        />
        {!hasData ? (
          <p className="uk-text-center no-data-message">There is no data.</p>
        ) : (
          <div className="card-wrap">
            <div className="card-content">
              <div className="winner-listing uk-grid">
                {finals.map((winner) => (
                  <div key={winner.team_name + winner.prize} className="uk-width-1-1 uk-width-1-2@m">
                    <div className="list">
                      <h3 className="winner-title">{renderPrizeTitle(winner.prize)}</h3>
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
