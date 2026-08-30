import * as React from 'react';
import { resolveFfw2023Image } from '../../ffw2023/assets/ffw2023AssetMap';

interface IHighlightCard {
  image: string;
  title: string;
  name: string;
  subtitle?: string;
  date: string;
}

const HIGHLIGHT_CARDS: IHighlightCard[] = [
  {
    image: 'public/images/10Jul/image-2.png',
    title: 'Preparing ourselves to harness the potential of Gen AI in our work',
    name: 'Nimish PANCHMATIA and Ying Yuan NG',
    date: '19 July, 1PM - 1:50PM'
  },
  {
    image: 'public/images/10Jul/image-1.png',
    title: 'GMC Career Journey Sharing',
    name: 'Kwee Juan HAN, Him Chuan LIM, Ginger Sze Ching CHENG and Sier Han NG',
    date: '19 July, 2PM - 2:50PM'
  },
  {
    image: 'public/images/10Jul/image-4.png',
    title: 'Sleep',
    name: 'Yan Hong LEE',
    subtitle: 'Dr Michelle Cheung, Raffles Medical Group',
    date: '20 July, 3PM - 3:50PM'
  },
  {
    image: 'public/images/10Jul/image-3.png',
    title: 'Nutrition',
    name: 'Dr Matthew Tan, Dr Tan Medical Center',
    date: '20 July, 3PM - 3:50PM'
  }
];

export const PostEventHighlights: React.FC = () => (
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
                    <div className="sub-content">
                      <p className="name">{card.name}</p>
                      {card.subtitle ? <p>{card.subtitle}</p> : null}
                    </div>
                    <p>{card.date}</p>
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
