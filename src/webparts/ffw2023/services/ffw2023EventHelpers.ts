import type { IEventItem } from '../services/ffw2023Types';

export function groupEventsByDate(events: IEventItem[]): Record<string, IEventItem[]> {
  const grouped: Record<string, IEventItem[]> = {};
  const dateSet: { [key: string]: boolean } = {};

  events.forEach((event) => {
    dateSet[event.date] = true;
  });

  Object.keys(dateSet).forEach((date) => {
    grouped[date] = events.filter((e) => e.date === date);
  });

  return grouped;
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

export function countryHasWinnerData(countryData: { final?: unknown[]; semi_final?: unknown[] } | undefined): boolean {
  if (!countryData) {
    return false;
  }

  return (
    (countryData.final?.length ?? 0) > 0 ||
    (countryData.semi_final?.length ?? 0) > 0
  );
}
