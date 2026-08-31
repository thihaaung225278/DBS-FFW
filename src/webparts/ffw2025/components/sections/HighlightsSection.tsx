import * as React from 'react';

const HIGHLIGHTS: Array<{
  key: string;
  title?: string;
  titleLines?: string[];
  paragraphs: string[];
  link?: { href: string; className: string; label: string };
}> = [
  {
    key: 'future-self',
    title: 'Live Fulfilled Carnival: Your Future Self',
    paragraphs: [
      'Unlock new skills, insights & possibilities at this year\'s Live Fulfilled Carnival.',
      'Forget the usual career booths because this year, we\'re bringing you interactive, hands-on experiences and sessions to help you to Level up Your Future Self.',
      'Check out the line up below!'
    ]
  },
  {
    key: 'future-skills',
    title: 'Unleash your Future Skills Competition',
    paragraphs: [
      'Supercharge your growth with the Unleash Your Future Skills Competition!',
      'Stand to win exciting prizes as you build your GenAI superpowers, sharpen essential life skills, complete weekly missions, and recognise colleagues who share their GenAI knowledge!'
    ],
    link: {
      href: 'https://dbs1bank.sharepoint.com/sites/sgGenAI/home/overview.aspx',
      className: 'find-out-more-link',
      label: 'Find Out More'
    }
  },
  {
    key: 'dyk-2025',
    titleLines: ['Did You Know?', '2025'],
    paragraphs: [
      'Ready to level up your skills and win big? Test your knowledge across 4 key domains — GenAI, Technical Skills, Well-being, and Power Skills — in the DYK 2025 Challenge!',
      'Collect Knowledge Gems, become a DYK Champion, and win amazing prizes.'
    ],
    link: {
      href: 'https://dbs1bank.sharepoint.com/sites/sgdidyouknow/SitePages/2025DidYouKnow.aspx',
      className: 'lets-go-link',
      label: "Let's Go"
    }
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
              <div className="card-item" key={card.key}>
                <div className="content">
                  <h3>
                    {card.titleLines ? (
                      <>
                        {card.titleLines[0]}
                        <br />
                        {card.titleLines[1]}
                      </>
                    ) : (
                      card.title
                    )}
                  </h3>
                  {card.paragraphs.map((text) => (
                    <p className="desc" key={text}>
                      {text}
                    </p>
                  ))}
                  {card.link ? (
                    <p className="desc">
                      <a
                        href={card.link.href}
                        className={card.link.className}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {card.link.label}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
