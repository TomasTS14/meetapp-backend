import { Event } from "./Event";

interface EventRepository {
    getEvents(): Promise<Event[]>;

    getEventsByRegion(region: string, country_code: string): Promise<Event[]>;

    getEventById(id: number): Promise<Event | null>;

    saveEvent(event: Event): Promise<Event>;

    getAppuserEvents(appuser_id: number): Promise<Event[]>;

    getNewEventsForAppuser(appuser_id: number, region: string, country: string): Promise<Event[]>;

    getEventsAppuserLikes(appuser_id: number): Promise<Event[]>;

    setInteractionBetweenAppuserAndEvent(appuser_id: number, event_id: number, liked: boolean): Promise<Event | null>;

    deleteAppuserEventInteraction(appuser_id: number, event_id: number): Promise<void>

    deleteEvent(id: number): Promise<void>;
}

export { EventRepository }