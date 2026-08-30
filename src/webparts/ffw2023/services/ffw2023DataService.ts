import type {
  IEventsData,
  IFfw2023LoadResult,
  IParticipantsData,
  IWinnersData
} from './ffw2023Types';

/* eslint-disable @typescript-eslint/no-var-requires */
const participantsData = require('../assets/data/participants.json') as IParticipantsData;
const eventsData = require('../assets/data/events.json') as IEventsData;
const postEventData = require('../assets/data/post-event.json') as IWinnersData;

export class Ffw2023DataService {
  public loadAll(): IFfw2023LoadResult {
    return {
      data: {
        participants: participantsData,
        events: eventsData,
        winners: postEventData
      },
      failedFiles: []
    };
  }
}
