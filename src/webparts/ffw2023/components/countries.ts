export interface ICountryOption {
  value: string;
  label: string;
}

export const PARTICIPANT_COUNTRIES: ICountryOption[] = [
  { value: 'sg', label: 'Singapore' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'ch', label: 'China' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'india', label: 'India - DBIL' },
  { value: 'india2', label: 'India - DTI' },
  { value: 'indo', label: 'Indonesia' }
];

export const SCHEDULE_COUNTRIES: ICountryOption[] = [
  { value: 'sg', label: 'Singapore' },
  { value: 'id', label: 'Indonesia' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'ics', label: 'International Centres' }
];

export const WINNER_COUNTRIES: ICountryOption[] = [
  { value: 'sg', label: 'Singapore' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'cn', label: 'China' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'india', label: 'India - DBIL' },
  { value: 'indo', label: 'Indonesia' }
];

export const VIDEO_HIGHLIGHT_COUNTRIES: ICountryOption[] = SCHEDULE_COUNTRIES;
