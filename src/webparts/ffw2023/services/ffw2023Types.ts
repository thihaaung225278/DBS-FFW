export interface IParticipant {
  department: string;
  name: string;
  spacer?: boolean;
}

export interface IParticipantsData {
  participants: Record<string, IParticipant[]>;
}

export interface IEventItem {
  CheckId?: number;
  date: string;
  time_start: string;
  time_end: string;
  title: string;
  speaker: string[];
  designation: string[];
  moderator: string[];
  content: string;
  icl_link?: string;
  join_link?: string;
  video_link?: string;
}

export interface ICountryEvents {
  'event-start-date': string;
  'event-end-date': string;
  events: IEventItem[];
}

export type IEventsData = Record<string, ICountryEvents>;

export interface IWinnerFinal {
  prize: string;
  prize_item: string;
  team_name: string;
  results: string[];
}

export interface IWinnerSemiFinal {
  team_name: string;
  results: string[];
}

export interface ICountryWinners {
  final?: IWinnerFinal[];
  semi_final?: IWinnerFinal[] | IWinnerSemiFinal[];
}

export type IWinnersData = Record<string, ICountryWinners>;

export interface IFfw2023LoadedData {
  participants: IParticipantsData | null;
  events: IEventsData | null;
  winners: IWinnersData | null;
}

export interface IFfw2023LoadResult {
  data: IFfw2023LoadedData;
  failedFiles: string[];
}

export type ScheduleStatus = 'live' | 'upcoming' | 'past';
