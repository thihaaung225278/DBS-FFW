import * as React from 'react';
import { CountryDropdown } from '../CountryDropdown';
import { PARTICIPANT_COUNTRIES } from '../countries';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';
import type { IParticipant } from '../../services/ffw2023Types';

export interface IParticipantsSectionProps {
  country: string;
  onCountryChange: (value: string) => void;
  participants: IParticipant[] | null;
}

function splitParticipants(list: IParticipant[]): { first: IParticipant[]; second: IParticipant[] } {
  if (list.length <= 7) {
    return { first: list, second: [] };
  }

  const mid = Math.ceil(list.length / 2);
  return { first: list.slice(0, mid), second: list.slice(mid) };
}

export const ParticipantsSection: React.FC<IParticipantsSectionProps> = ({
  country,
  onCountryChange,
  participants
}) => {
  const list = participants || [];
  const { first, second } = splitParticipants(list.filter((p) => p.spacer !== true));
  const showSecondColumn = second.length > 0;

  return (
    <section id="participants">
      <div className="uk-container">
        <h2 className="main-title"> Game Show </h2>
        <div className="card-wrap">
          <div className="logo">
            <img src={resolveFfw2023Image('public/images/p-logo.png')} alt="Game Show" />
          </div>
          <div className="card-content">
            <p>You want to Live Fulfilled, we can get you there.</p>
            <p>
              Our first DBS Game Show &apos;Who wants to Live Fulfilled&apos; - Did You Know Edition is here
              to equip you with the many Productivity tools, Total Rewards &amp; Employee Well-being resources
              you can leverage at DBS for a fulfilled career.
            </p>
            <p>Check out our contestants heading to the Live Game Show!</p>
            <p style={{ fontStyle: 'italic', fontSize: '12px' }}>
              <span>
                Brought to you by Future of Work (a part of Transformation Group), Human Resources and
                PeopleTech
              </span>
            </p>
            <CountryDropdown
              id="participant-dd"
              options={PARTICIPANT_COUNTRIES}
              selectedValue={country}
              onChange={onCountryChange}
            />
            <div className="participant-list">
              {list.length === 0 ? (
                <p>There have no participants.</p>
              ) : (
                <>
                  <div className="desktop-list uk-grid">
                    <div className="first-column uk-width-1-2">
                      <div className="uk-grid">
                        <div className="department uk-width-1-1">
                          <div className="uk-flex">
                            <p style={{ width: '50%' }}> Department</p>
                            <p style={{ width: '50%' }}> Name</p>
                          </div>
                          <ul>
                            {first.map((p, index) => (
                              <li
                                key={`${p.name}-${index}`}
                                className={index && !(index % 2) ? 'top-spacer' : undefined}
                              >
                                {showSecondColumn ? (
                                  <>
                                    <span>{p.department}</span>
                                    <span>{p.name}</span>
                                  </>
                                ) : (
                                  p.department
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {showSecondColumn ? (
                      <div className="sec-column uk-width-1-2">
                        <div className="uk-grid">
                          <div className="department uk-width-1-1">
                            <div className="uk-flex">
                              <p style={{ width: '50%' }}> Department</p>
                              <p style={{ width: '50%' }}> Name</p>
                            </div>
                            <ul>
                              {second.map((p, index) => (
                                <li
                                  key={`${p.name}-sec-${index}`}
                                  className={index && !(index % 2) ? 'top-spacer' : undefined}
                                >
                                  <span>{p.department}</span>
                                  <span>{p.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="mobile-list">
                    {list
                      .filter((p) => p.spacer !== true)
                      .map((p, index, arr) => {
                        const prev = index > 0 ? arr[index - 1] : undefined;
                        const spacerClass =
                          prev && prev.department !== p.department ? 'top-spacer' : undefined;
                        return (
                          <div key={`mobile-${p.name}-${index}`} className={`mobile-participant-list ${spacerClass || ''}`}>
                            <p className="dept">{p.department}</p>
                            <p className="name">{p.name}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
