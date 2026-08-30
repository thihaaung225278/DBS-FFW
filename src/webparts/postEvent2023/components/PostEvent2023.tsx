import * as React from 'react';
import styles from './PostEvent2023.module.scss';
import type { IPostEvent2023Props } from './IPostEvent2023Props';
import { escape } from '@microsoft/sp-lodash-subset';

const PostEvent2023: React.FC<IPostEvent2023Props> = (props) => {
  const { classicYear, classicPage, jsonBaseUrl } = props;

  return (
    <div className={styles.postEvent2023Root} data-classic-year={escape(classicYear)} data-classic-page={escape(classicPage)}>
      <p className={styles.baselineNote}>
        Baseline shell — {escape(classicPage)} ({escape(classicYear)}). Visual parity deferred to Wave 4.
      </p>

      <div className="lottie-container" data-region="lottie">
        <div className={styles.regionStub} aria-hidden="true" />
      </div>

      <header className="page-banner" data-region="banner">
        <div className={styles.regionStub} role="region" aria-label="Page banner" />
      </header>

      <section id="about" data-region="about">
        <div className={styles.regionStub} role="region" aria-label="About" />
      </section>
      <section id="highlight" data-region="highlight">
        <div className={styles.regionStub} role="region" aria-label="Highlights" />
      </section>
      <section id="schedule" data-region="schedule">
        <div className={styles.regionStub} role="region" aria-label="Schedule" />
      </section>
      <section id="game_show_winners" data-region="game-show-winners">
        <div className={styles.regionStub} role="region" aria-label="Game show winners" />
      </section>
      <section id="lucky_draw_winner" data-region="lucky-draw-winners">
        <div className={styles.regionStub} role="region" aria-label="Lucky draw winners" />
      </section>

      <footer data-region="footer">
        <div className={styles.regionStub} role="contentinfo" aria-label="Footer" />
      </footer>

      {jsonBaseUrl ? (
        <span className="ms-hidden" data-json-base-url={escape(jsonBaseUrl)} />
      ) : null}
    </div>
  );
};

export default PostEvent2023;
