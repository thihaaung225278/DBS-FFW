export interface IEventItem {
  CheckId?: number;
  date: string;
  categories?: string[];
  time_start: string;
  time_end: string;
  location?: string;
  title: string;
  speaker: string[];
  designation: string[];
  moderator: string[];
  content: string;
  video_link?: string;
  footnote?: string;
  timezone?: string;
}

export interface ICountryEvents {
  'event-start-date': string;
  'event-end-date': string;
  events: IEventItem[];
}

export type IEventsData = Record<string, ICountryEvents>;

export interface IFfw2024LoadedData {
  events: IEventsData | undefined;
}
