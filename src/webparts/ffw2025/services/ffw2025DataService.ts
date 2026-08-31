import type { IEventsData, IFfw2025LoadedData } from './ffw2025Types';

/* eslint-disable @typescript-eslint/no-var-requires */
const eventsData = require('../assets/data/events-current.json') as IEventsData;

export class Ffw2025DataService {
  public loadAll(): IFfw2025LoadedData {
    return {
      events: eventsData
    };
  }
}
