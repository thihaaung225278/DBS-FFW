import * as React from 'react';
import { resolveFfw2023Image } from '../../assets/ffw2023AssetMap';

export interface IAboutSectionProps {
  sectionId?: string;
  postEvent?: boolean;
}

export const AboutSection: React.FC<IAboutSectionProps> = ({
  sectionId = 'about',
  postEvent = false
}) => (
  <section id={sectionId}>
    <div className="uk-container">
      <h2 className="main-title">Invest in the Best of Me</h2>
      <div className="card-wrap">
        <div className="card-content">
          {postEvent ? (
            <>
              <p>Thank you for joining us at Future Forward Week!</p>
              <p>
                We hope you took the first step to building your long-term career with us at DBS,
                and invested in the Best of Me as you participated in the talks, booths &amp; Game Show.
              </p>
              <p>
                Continue to stay career resilient and achieve a healthy state of your career,
                physical, mental &amp; financial well-being.
              </p>
            </>
          ) : (
            <>
              <p>
                In our fast-paced world, it&apos;s no secret that career resilience is crucial for success.
                Building skills has never been more important in allowing us to adapt and thrive in the
                face of uncertainty.
              </p>
              <p>
                FutureForward Week is here to help you take the first step in building your long-term
                career. Join us as we equip ourselves to achieve a healthy state of our careers with
                Education, Exposure &amp; Experience opportunities, and not forgetting our physical,
                mental &amp; financial well-being too.
              </p>
              <p>Take the first step and invest in the Best of Me</p>
            </>
          )}
          <div
            className="about-bg-image"
            style={{
              backgroundImage: `url('${resolveFfw2023Image('public/images/about-bg.png')}')`
            }}
          />
        </div>
      </div>
    </div>
  </section>
);
