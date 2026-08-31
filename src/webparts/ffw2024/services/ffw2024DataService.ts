import type { IEventsData, IFfw2024LoadedData } from './ffw2024Types';

/* eslint-disable @typescript-eslint/no-var-requires */
const eventsData = require('../assets/data/events.json') as IEventsData;

export class Ffw2024DataService {
  public loadAll(): IFfw2024LoadedData {
    return {
      events: eventsData
    };
  }
}
