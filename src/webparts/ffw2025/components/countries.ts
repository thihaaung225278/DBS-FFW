export interface ICountryOption {
  value: string;
  label: string;
}

export const SCHEDULE_COUNTRIES: ICountryOption[] = [
  { value: 'sg', label: 'Singapore' },
  { value: 'cn', label: 'China' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'in', label: 'India' },
  { value: 'id', label: 'Indonesia' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'ics', label: 'International Centres' }
];
