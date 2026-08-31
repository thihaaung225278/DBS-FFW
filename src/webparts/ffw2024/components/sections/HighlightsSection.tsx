import * as React from 'react';
import { resolveFfw2024Image } from '../../assets/ffw2024AssetMap';

const HIGHLIGHTS = [
  {
    image: 'public/images/2024/Highlights/highlight-1.jpg',
    title: 'FutureForward Week',
    titleBreak: false,
    desc: (
      <>
        Future Forward week is all about{' '}
        <span> empowering our personal capabilities, competency &amp; resilience </span> in the
        different facets of our self, including our career, physical, mental &amp; financial
        well-being.
      </>
    )
  },
  {
    image: 'public/images/2024/Highlights/highlight-2.jpg',
    title: 'Various Local Wellness Day',
    titleBreak: true,
    titleLine1: 'Various Local',
    titleLine2: 'Wellness Day',
    desc: (
      <>
        This is your chance to level up your physical well-being, but more importantly an
        opportunity to <span> nurture positive relationships and drive collaboration </span> with
        those around you, while getting to know more colleagues in DBS through fun and games!
      </>
    )
  },
  {
    image: 'public/images/2024/Highlights/highlight-3.jpg',
    title: 'Staff Appreciation Week',
    titleBreak: true,
    titleLine1: 'Staff Appreciation',
    titleLine2: 'Week',
    desc: (
      <>
        A great culture starts from a heart of gratitude, and we celebrate &amp; appreciate you
        for playing a role in DBS’s success. On our mission to{' '}
        <span> co-create and engender a healthy work culture, </span> we are inviting you to also
        take this opportunity to show your appreciation for those who’ve helped you{' '}
        <span> thrive </span> in DBS.
      </>
    )
  }
];

export const HighlightsSection: React.FC = () => {
  return (
    <section id="highlight">
      <div className="uk-container main-container">
        <h2 className="main-title">Highlights</h2>
        <div className="card-wrapper">
          <div className="card-grid">
            {HIGHLIGHTS.map((card) => (
              <div className="card-item" key={card.image}>
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url('${resolveFfw2024Image(card.image)}')`
                  }}
                  role="img"
                  aria-label={card.title}
                />
                <div className="content">
                  <h3>
                    {card.titleBreak ? (
                      <>
                        {card.titleLine1}
                        <br />
                        {card.titleLine2}
                      </>
                    ) : (
                      card.title
                    )}
                  </h3>
                  <p className="desc">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
