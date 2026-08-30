import * as React from 'react';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';

const HIGHLIGHT_CARDS = [
  {
    image: 'public/images/17Jul/image-2.png',
    title: 'EX Council, Workbench, Workflow',
    name: 'Linda Sim Peng LEE',
    date: '19 July, 3PM - 3:50PM'
  },
  {
    image: 'public/images/17Jul/image-3.png',
    title: 'From Insights to Action: Exploring the Impact of Generative AI on Work, Learning, and Society',
    name: 'Soumee DE',
    subtitle: 'Partner, People Advisory Services EY Singapore',
    date: '20 July, 10AM - 10:50AM'
  },
  {
    image: 'public/images/17Jul/image-1.png',
    title: 'Career Jam (Various sessions locally)',
    date: '20 - 21 July',
    dateNote: 'Refer to schedule for more details'
  },
  {
    image: 'public/images/17Jul/image-4.png',
    title: "Let's get fit! (Various sessions locally)",
    date: '19 - 21 July',
    dateNote: 'Refer to schedule for more details'
  }
];

export const HighlightsSection: React.FC = () => (
  <section id="highlight">
    <div className="uk-container">
      <h2 className="main-title">Highlights</h2>
      <div className="card-wrap">
        <p>
          Join us as we equip ourselves to achieve a healthy state of our careers with Education,
          Exposure &amp; Experience opportunities, and not forgetting our physical, mental &amp;
          financial well-being too.
        </p>
        <div className="card-content" style={{ marginTop: '40px' }}>
          <div className="uk-text-center uk-grid">
            {HIGHLIGHT_CARDS.map((card) => (
              <div key={card.title} className="uk-width-1-1 uk-width-1-2@m">
                <div className="card">
                  <div className="overlay" />
                  <div
                    className="bg-image"
                    style={{
                      backgroundImage: `url('${resolveFfw2023Image(card.image)}')`
                    }}
                  />
                  <div className="contents">
                    <p className="title">{card.title}</p>
                    {card.name ? (
                      <div className="sub-content">
                        <p className="name">{card.name}</p>
                        {card.subtitle ? <p>{card.subtitle}</p> : null}
                      </div>
                    ) : null}
                    <p>
                      {card.date}
                      {card.dateNote ? (
                        <>
                          <br />
                          {card.dateNote}
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
