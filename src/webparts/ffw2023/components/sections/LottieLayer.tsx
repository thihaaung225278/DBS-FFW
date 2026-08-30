import * as React from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { getFfw2023LottieAnimation } from '../../assets/ffw2023AssetMap';

/** Classic common.js load order — container id → public/json path */
const LOTTIE_CONFIG: ReadonlyArray<{ id: string; classicPath: string }> = [
  { id: 'human-lottie', classicPath: 'public/json/Human.json' },
  { id: 'bag-lottie', classicPath: 'public/json/Bag.json' },
  { id: 'coin-lottie', classicPath: 'public/json/Coin.json' },
  { id: 'heart1-lottie', classicPath: 'public/json/Heart1.json' },
  { id: 'heart2-lottie', classicPath: 'public/json/Heart2.json' },
  { id: 'leaf1-lottie', classicPath: 'public/json/Leaf1.json' },
  { id: 'leaf2-lottie', classicPath: 'public/json/Leaf2.json' },
  { id: 'red-circle-lottie', classicPath: 'public/json/Red Circle.json' },
  { id: 'star-lottie', classicPath: 'public/json/Star.json' },
  { id: 'white-speech-lottie', classicPath: 'public/json/White Speech.json' },
  { id: 'yellow-speech-lottie', classicPath: 'public/json/Yellow Speech.json' }
];

export interface ILottieLayerProps {
  onReady?: () => void;
}

export const LottieLayer: React.FC<ILottieLayerProps> = ({ onReady }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const onReadyRef = React.useRef(onReady);

  React.useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return;
    }

    const animations: AnimationItem[] = [];
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (const { id, classicPath } of LOTTIE_CONFIG) {
      const container = root.querySelector<HTMLElement>(`#${id}`);
      const animationData = getFfw2023LottieAnimation(classicPath);

      if (!container || !animationData) {
        if (!animationData) {
          console.warn('[Ffw2023] Missing Lottie data for:', classicPath);
        }
        continue;
      }

      try {
        const animation = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: !prefersReducedMotion,
          animationData
        });

        if (prefersReducedMotion) {
          animation.goToAndStop(0, true);
        }

        animations.push(animation);
      } catch (error) {
        console.warn('[Ffw2023] Lottie load failed for:', classicPath, error);
      }
    }

    onReadyRef.current?.();

    return () => {
      animations.forEach((animation) => animation.destroy());
    };
  }, []);

  return (
    <div ref={containerRef} className="lottie-container" aria-hidden="true">
      {LOTTIE_CONFIG.map(({ id }) => (
        <div key={id} id={id} className="lottie-animation" />
      ))}
    </div>
  );
};
