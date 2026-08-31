import * as React from 'react';
import type { IEventItem } from './ffw2025Types';

export interface IGroupedScheduleEvent {
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
  date: string;
  formattedDateRange: string;
}

function formatDateParts(date: Date): { day: number; month: string; year: number; weekday: string } {
  return {
    day: date.getDate(),
    month: date.toLocaleString('en-US', { month: 'long' }),
    year: date.getFullYear(),
    weekday: date.toLocaleString('en-US', { weekday: 'long' })
  };
}

export function formatDateRange(dates: string[]): string {
  if (!dates.length) {
    return '';
  }

  const parsed = dates.map((d) => new Date(`${d}T00:00:00`));
  const minDate = new Date(Math.min.apply(null, parsed.map((d) => d.getTime())));
  const maxDate = new Date(Math.max.apply(null, parsed.map((d) => d.getTime())));
  const min = formatDateParts(minDate);
  const max = formatDateParts(maxDate);

  if (minDate.getTime() === maxDate.getTime()) {
    return `${min.day} ${min.month} ${min.year}, ${min.weekday}`;
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

function parseTimeToMinutes(timeStart: string): number {
  const match = (timeStart || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!match) {
    return 0;
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = (match[3] || '').toUpperCase();

  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function eventSortValue(event: IEventItem): number {
  const dateMs = new Date(`${event.date}T00:00:00`).getTime();
  if (isNaN(dateMs)) {
    return 0;
  }

  return dateMs + parseTimeToMinutes(event.time_start) * 60 * 1000;
}

export function sortEventsByDateTime(events: IEventItem[]): IEventItem[] {
  return events.slice().sort((a, b) => eventSortValue(a) - eventSortValue(b));
}

export function getLocalDateFormatted(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

export function isEventPast(date: string, today: string): boolean {
  return !!date && date < today;
}

export function groupScheduleEvents(events: IEventItem[]): IGroupedScheduleEvent[] {
  const grouped: Record<string, IEventItem[]> = {};

  sortEventsByDateTime(events).forEach((event) => {
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
      date: first.date,
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

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, '');
}

const HREF_ATTR_RE = /href\s*=\s*["']([^"']*)["']/i;

function getHrefAttr(attrs: string): string {
  const match = attrs.match(HREF_ATTR_RE);
  return match ? match[1] : '';
}

/** Classic `.desc` allowlist: `<br>` + https `<a>` only. */
export function renderScheduleContent(text: string): React.ReactNode {
  if (!text) {
    return null;
  }

  const nodes: React.ReactNode[] = [];
  const tokenRe = /<br\s*\/?>|<a\s+([^>]*)>([\s\S]*?)<\/a>/gi;
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
    } else {
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
    }

    lastIndex = tokenRe.lastIndex;
    match = tokenRe.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(stripTags(text.slice(lastIndex)));
  }

  return nodes;
}
