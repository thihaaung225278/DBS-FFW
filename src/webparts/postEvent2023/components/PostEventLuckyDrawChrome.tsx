import * as React from 'react';

/** Classic post-event.aspx lucky-draw JS is commented out — keep live chrome only. */
export const PostEventLuckyDrawChrome: React.FC = () => (
  <section id="lucky_draw_winner">
    <div className="uk-container">
      <h2 className="main-title">Lucky Draw winners</h2>
      <div className="card-wrap">
        <div className="card-content">
          <div className="ld-listing uk-grid" />
          <div className="consolation_prize">
            <h4>Consolation Prize</h4>
            <div className="con-prize-list" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
