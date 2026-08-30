import * as React from 'react';
import { Ffw2023DataService } from '../services/ffw2023DataService';
import type { IFfw2023LoadedData } from '../services/ffw2023Types';
import { formatDateYmd, isAfterEventEnd } from '../../../shared/ffw2023/dateHelpers';

export interface IUseFfw2023DataResult {
  data: IFfw2023LoadedData;
  participantCountry: string;
  setParticipantCountry: (value: string) => void;
  scheduleCountry: string;
  setScheduleCountry: (value: string) => void;
  winnerCountry: string;
  setWinnerCountry: (value: string) => void;
  videoCountry: string;
  setVideoCountry: (value: string) => void;
  showPostEvent: boolean;
}

export function useFfw2023Data(): IUseFfw2023DataResult {
  const loaded = React.useMemo(() => new Ffw2023DataService().loadAll(), []);

  const [participantCountry, setParticipantCountry] = React.useState('sg');
  const [scheduleCountry, setScheduleCountry] = React.useState('sg');
  const [winnerCountry, setWinnerCountry] = React.useState('sg');
  const [videoCountry, setVideoCountry] = React.useState('sg');
  const [showPostEvent, setShowPostEvent] = React.useState(false);

  React.useEffect(() => {
    const sgEvents = loaded.data.events?.sg;

    if (sgEvents) {
      const curDate = formatDateYmd();
      setShowPostEvent(isAfterEventEnd(curDate, sgEvents['event-end-date']));
    } else {
      setShowPostEvent(true);
    }
  }, [loaded.data.events]);

  return {
    data: loaded.data,
    participantCountry,
    setParticipantCountry,
    scheduleCountry,
    setScheduleCountry,
    winnerCountry,
    setWinnerCountry,
    videoCountry,
    setVideoCountry,
    showPostEvent
  };
}
