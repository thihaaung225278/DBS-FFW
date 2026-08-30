import * as React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

export type ClassicSwiperVariant = 'winner' | 'gallery';

export interface IClassicSwiperSlide {
  key: string;
  backgroundImage: string;
  ariaLabel?: string;
}

export interface IClassicSwiperProps {
  variant: ClassicSwiperVariant;
  slides: IClassicSwiperSlide[];
  contentClassName: 'gallery' | 'team-photo';
}

const GALLERY_BREAKPOINTS = {
  640: { slidesPerView: 2 },
  768: { slidesPerView: 3 }
} as const;

export const ClassicSwiper: React.FC<IClassicSwiperProps> = ({
  variant,
  slides,
  contentClassName
}) => {
  const swiperRef = React.useRef<SwiperInstance | null>(null);

  React.useEffect(() => {
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, []);

  const containerClassName =
    variant === 'gallery'
      ? 'swiper gallery-wrap gallery-slider'
      : 'swiper winner-slider';

  return (
    <Swiper
      className={containerClassName}
      modules={[Navigation]}
      navigation
      watchOverflow={false}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      {...(variant === 'gallery'
        ? {
            slidesPerView: 1,
            spaceBetween: 10,
            breakpoints: GALLERY_BREAKPOINTS
          }
        : {})}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.key} className="swiper-slide">
          <div
            className={contentClassName}
            style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
            role="img"
            aria-label={slide.ariaLabel || undefined}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
