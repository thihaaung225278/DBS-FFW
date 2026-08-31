import * as React from 'react';
import type { IEventItem } from './ffw2024Types';

export interface IGroupedPlaybackEvent {
  title: string;
  location: string;
  speaker: string[];
  designation: string[];
  moderator: string[];
  content: string;
  time_start: string;
  time_end: string;
  timezone: string;
  footnote: string;
  video_link: string;
  formattedDateRange: string;
}

function padDay(day: number): string {
  return String(day);
}

function formatDateParts(date: Date): { day: string; month: string; year: number } {
  return {
    day: padDay(date.getDate()),
    month: date.toLocaleString('en-US', { month: 'short' }),
    year: date.getFullYear()
  };
}

export function formatDateRange(dates: string[]): string {
  if (!dates.length) {
    return '';
  }

  const parsed = dates.map((d) => new Date(d));
  const minDate = new Date(Math.min.apply(null, parsed.map((d) => d.getTime())));
  const maxDate = new Date(Math.max.apply(null, parsed.map((d) => d.getTime())));
  const min = formatDateParts(minDate);
  const max = formatDateParts(maxDate);

  if (minDate.getTime() === maxDate.getTime()) {
    return `${min.day} ${min.month} ${min.year}`;
  }

  if (min.month === max.month && min.year === max.year) {
    return `${min.day} ${min.month} - ${max.day} ${max.month} ${max.year}`;
  }

  return `${min.day} ${min.month} ${min.year} - ${max.day} ${max.month} ${max.year}`;
}

export function formatSpeakerLine(speakers: string[], designations: string[]): string {
  if (!speakers.length) {
    return '';
  }

  if (speakers.length === 1) {
    const designation = designations[0] ? ` (${designations[0]})` : '';
    return `${speakers[0]}${designation}`;
  }

  return speakers
    .map((name, index) => {
      const designation = designations[index] ? ` (${designations[index]})` : '';
      const nameWithDesignation = ` ${name}${designation}`;

      if (index === speakers.length - 1) {
        return `and${nameWithDesignation}`;
      }

      if (index === speakers.length - 2) {
        return nameWithDesignation.trim();
      }

      return `${nameWithDesignation},`;
    })
    .join(' ');
}

/** Classic `getEvents`: uniqueDates first-seen, then all events of each date. */
export function flattenEventsByDate(events: IEventItem[]): IEventItem[] {
  const uniqueDates: string[] = [];
  const seen: Record<string, boolean> = {};

  events.forEach((event) => {
    if (!seen[event.date]) {
      seen[event.date] = true;
      uniqueDates.push(event.date);
    }
  });

  const flattened: IEventItem[] = [];
  uniqueDates.forEach((date) => {
    events.forEach((event) => {
      if (event.date === date) {
        flattened.push(event);
      }
    });
  });

  return flattened;
}

export function groupPlaybackEvents(events: IEventItem[]): IGroupedPlaybackEvent[] {
  const grouped: Record<string, IEventItem[]> = {};

  flattenEventsByDate(events).forEach((event) => {
    const categories = event.categories || [];
    const key = `${event.title}_${categories.join('_')}_${event.location || ''}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(event);
  });

  return Object.keys(grouped).map((key) => {
    const group = grouped[key];
    const first = group[0];
    return {
      title: first.title,
      location: first.location || '',
      speaker: first.speaker || [],
      designation: first.designation || [],
      moderator: first.moderator || [],
      content: first.content || '',
      time_start: first.time_start || '',
      time_end: first.time_end || '',
      timezone: first.timezone || '',
      footnote: first.footnote || '',
      video_link: first.video_link || '',
      formattedDateRange: formatDateRange(group.map((item) => item.date))
    };
  });
}

const ALLOWED_PROTOCOLS = /^https?:$/i;

export function isSafeHttpUrl(url: string): boolean {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.test(parsed.protocol);
  } catch {
    return false;
  }
}

const ALLOWED_SEE_IT_SRC = 'public/images/2024/see-it.png';

export type ResolvePlaybackImage = (classicSrc: string) => string | undefined;

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, '');
}

const HREF_ATTR_RE = /href\s*=\s*["']([^"']*)["']/i;
const SRC_ATTR_RE = /src\s*=\s*["']([^"']*)["']/i;

function getHrefAttr(attrs: string): string {
  const match = attrs.match(HREF_ATTR_RE);
  return match ? match[1] : '';
}

function getSrcAttr(attrs: string): string {
  const match = attrs.match(SRC_ATTR_RE);
  return match ? match[1] : '';
}

function normalizeClassicPath(src: string): string {
  return src.replace(/\\/g, '/').replace(/^\.\//, '').trim();
}

/** Classic `.desc` allowlist: `<br>`, https `<a>`, `see-it.png` `<img>` only. */
export function renderPlaybackContent(
  text: string,
  resolveImage?: ResolvePlaybackImage
): React.ReactNode {
  if (!text) {
    return null;
  }

  const nodes: React.ReactNode[] = [];
  const tokenRe = /<br\s*\/?>|<a\s+([^>]*)>([\s\S]*?)<\/a>|<img\s+([^>]*?)\/?>/gi;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null = tokenRe.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(stripTags(text.slice(lastIndex, match.index)));
    }

    const token = match[0];

    if (/^<br/i.test(token)) {
      nodes.push(<br key={key++} />);
    } else if (/^<a/i.test(token)) {
      const href = getHrefAttr(match[1]);
      const inner = stripTags(match[2]);

      if (isSafeHttpUrl(href)) {
        nodes.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        );
      } else if (inner) {
        nodes.push(inner);
      }
    } else {
      const classicSrc = normalizeClassicPath(getSrcAttr(match[3]));

      if (classicSrc === ALLOWED_SEE_IT_SRC) {
        const bundled = resolveImage?.(classicSrc);

        if (bundled) {
          nodes.push(<img key={key++} src={bundled} alt="" />);
        }
      }
    }

    lastIndex = tokenRe.lastIndex;
    match = tokenRe.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(stripTags(text.slice(lastIndex)));
  }

  return nodes;
}
