import * as React from 'react';

interface ILuckyDrawWinner {
  name: string;
  market: string;
  busu: string;
}

const PARTICIPATION_LUCKY_DRAW_WINNERS: ILuckyDrawWinner[] = [
  { name: 'CHOE Irene', market: 'Singapore', busu: 'Group Human Resources' },
  { name: 'TAN Lucas Wei Loong', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'Du Huixuan', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'CHEN Sylvia Ssu Wei', market: 'Taiwan', busu: 'Group Human Resources' },
  { name: 'LIN Joe Zong Yi', market: 'Taiwan', busu: 'Central Operations' },
  { name: 'ZHANG Carol Li Hong', market: 'China', busu: 'Group Legal, Compliance & Secretariat' },
  { name: 'JIN Ken Zhe', market: 'China', busu: 'Technology & Operations' },
  { name: 'YUEN Nicole Lok Chi', market: 'Hong Kong', busu: 'Central Operations' },
  { name: 'LAM Celia Ching Yin', market: 'Hong Kong', busu: 'Group Strategy & Planning' },
  { name: 'Gadam Rajan', market: 'India', busu: 'Central Operations' },
  { name: 'SHETYE Saiprasad', market: 'India', busu: 'Institutional Banking Group' },
  { name: 'HASIBUAN Nila Kesuma', market: 'Indonesia', busu: 'Institutional Banking Group' },
  { name: 'NAWA Anigusye', market: 'Indonesia', busu: 'Technology & Operations' },
  { name: 'SIOW Wee Chiang', market: 'International Centres', busu: 'Central Operations' }
];

const METAVERSE_LUCKY_DRAW_WINNERS: ILuckyDrawWinner[] = [
  { name: 'CHU Alex Chi Ho (朱致豪)', market: 'Hong Kong', busu: 'Consumer Banking Group' },
  { name: 'Indra Ristin Octaviana', market: 'Indonesia', busu: 'Group Strategy and Planning' },
  { name: 'TAI Charmaine Si Min', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'Bompelliwar Sahaja', market: 'India', busu: 'Technology & Operations' },
  { name: 'SIU Jane Hoi Ching (蕭愷澄)', market: 'Hong Kong', busu: 'Consumer Banking Group' },
  { name: 'WONG Debby Suet Mui (黃雪梅)', market: 'Hong Kong', busu: 'Technology & Operations' },
  { name: 'TAN Ming Sheng, Ian Paul', market: 'Singapore', busu: 'Group Strategy and Planning' },
  { name: 'WONG Karen Hoi Lam (黃海琳)', market: 'Hong Kong', busu: 'Group Human Resources' },
  { name: 'HO Chee Kean', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'SIM Brendan Han Kiang', market: 'Singapore', busu: 'Consumer Banking Group' },
  { name: 'NORMAN Suryana', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'G Venkat Ramesh', market: 'India', busu: 'Technology & Operations' },
  { name: 'GOH Shu Yu', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'BHUPALAM Suresh', market: 'India', busu: 'Technology & Operations' },
  { name: 'SAMAUN Bonnie', market: 'Singapore', busu: 'Risk Management Group' },
  { name: 'KONG Gabriel Lap Hin (江立軒)', market: 'Hong Kong', busu: 'Group Finance' },
  { name: 'TAY Darren Wei Tiong', market: 'Singapore', busu: 'DBS Transformation Group' },
  { name: 'CHEUK Aden Kai Yin (卓啟彥)', market: 'Hong Kong', busu: 'Group Human Resources' },
  { name: 'Puligadda V S N Pavan', market: 'India', busu: 'Technology & Operations' },
  { name: 'CHAN Wilhelm Chi Hang (陳智恒)', market: 'Hong Kong', busu: 'Group Finance' },
  { name: 'Agustian R M Reza', market: 'Indonesia', busu: 'Technology & Operations' },
  { name: 'BATHWAL Neha', market: 'India', busu: 'Group Finance' },
  { name: 'TSANG Jessica Ka Ki (曾嘉琪)', market: 'Hong Kong', busu: 'Institutional Banking Group' },
  { name: 'KOH Ngiap Seng', market: 'Singapore', busu: 'Consumer Banking Group' },
  { name: 'CHEW Tuan Loong', market: 'Singapore', busu: 'Consumer Banking Group' },
  { name: 'M Basappa', market: 'India', busu: 'Technology & Operations' },
  { name: 'TOBING Kurnia Kusuma Dewi', market: 'Indonesia', busu: 'Institutional Banking Group' },
  { name: 'CHAN Maria Ying Kan (陳瑩瑾)', market: 'Hong Kong', busu: 'Risk Management Group' },
  { name: 'FUNG Shirley Sui Ying (馮瑞瑩)', market: 'Hong Kong', busu: 'Group Human Resources' },
  { name: 'BANSAL Manvi Gupta', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'WONG Judy Siu Tung (黃少彤)', market: 'Hong Kong', busu: 'Institutional Banking Group' },
  { name: 'SOH Pauline Ghim Peck', market: 'Singapore', busu: 'Risk Management Group' },
  { name: 'PUNG Kelvin Zheng Jie', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'JACOB Angellina V. Suntoso', market: 'Indonesia', busu: 'Consumer Banking Group' },
  { name: 'NGOO Jia Xun', market: 'Singapore', busu: 'Technology & Operations' },
  { name: 'CHOI Andy Ka Lun (蔡嘉倫)', market: 'Hong Kong', busu: 'Technology & Operations' },
  { name: 'SIOW Wee Chiang', market: 'Malaysia', busu: 'Central Operations' },
  { name: 'Varada Akash', market: 'India', busu: 'Technology & Operations' },
  { name: 'POON Kahlen Ka Ling (潘家玲)', market: 'Hong Kong', busu: 'Group Human Resources' },
  { name: 'Fartiyal Meenakshi', market: 'India', busu: 'Risk Management Group' }
];

interface ILuckyDrawBlockProps {
  title: string;
  pointsMessage: React.ReactNode;
  winners: ILuckyDrawWinner[];
}

const LuckyDrawBlock: React.FC<ILuckyDrawBlockProps> = ({ title, pointsMessage, winners }) => (
  <>
    <h3>{title}</h3>
    <div className="sub-text">
      <p className="won-points">{pointsMessage}</p>
      <p className="redemption-note">Look out for an iTQ/WeTQ email on points redemption.</p>
    </div>
    <div className="ld-listing">
      <div className="list-wrap futureforward-week">
        <div className="list uk-flex">
          <ul>
            {winners.map((winner) => (
              <li key={`${winner.name}-${winner.market}`} className="uk-flex">
                <p className="name">{winner.name}</p>
                <p className="market">{winner.market}</p>
                <p className="busu">{winner.busu}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
);

export const LuckyDrawSection: React.FC = () => (
  <section id="lucky_draw_winner">
    <div className="uk-container">
      <h2 className="main-title">Lucky Draw winners</h2>
      <div className="card-wrap">
        <div className="card-content">
          <LuckyDrawBlock
            title="FFW Participation Lucky Draw"
            pointsMessage={
              <>
                Congratulations! You&apos;ve won 4,000 iTQ points by participating in the &ldquo;Who wants
                to Live Fulfilled&rdquo; - Did you know edition online quiz, attending FFW &amp;
                completing our FFW survey.
              </>
            }
            winners={PARTICIPATION_LUCKY_DRAW_WINNERS}
          />
          <LuckyDrawBlock
            title="FFW Metaverse Lucky Draw"
            pointsMessage={
              <>
                Congratulations! You&apos;ve won 500 iTQ points by completing all the quests in the
                metaverse.
              </>
            }
            winners={METAVERSE_LUCKY_DRAW_WINNERS}
          />
        </div>
      </div>
    </div>
  </section>
);

export const FooterSection: React.FC = () => (
  <footer>
    <div className="uk-container">
      <p className="text-1">Brought to you by</p>
      <p className="text-2">Group Human Resources</p>
    </div>
  </footer>
);
