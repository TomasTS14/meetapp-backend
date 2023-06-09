import { EventRepository } from "../domain/Events.repository";
import { Event } from "../domain/Event";
import { Coordinates } from "../domain/coordinates";
import { getCoordinates, getPlaceByCoordinates } from "../../_context/positionStack/positionStackFetch";
import { Place } from "../domain/Place";
import { rightDistance } from "../../_context/distance/rightDistance";


class EventUsecases {

    eventRepository: EventRepository

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository
    }

    async getEvents(): Promise<Event[]> {

        return await this.eventRepository.getEvents();
    }

    async getAppuserEvents(appuser_id: number): Promise<Event[]> {
        try {
            const events: Event[] = await this.eventRepository.getAppuserEvents(appuser_id)
            return events;
        } catch (err) {
            console.error(err)
        }
        return [];
    }

    async getNewEventsForAppuser(appuser_id: number, maxDistance: number, coordinates: Coordinates): Promise<Event[]> {

        try {
            const myPlace: Place | null = await getPlaceByCoordinates(coordinates);
            console.log("myPlace: " + JSON.stringify(myPlace));


            if (myPlace) {
                console.log("events in region for appuser " + appuser_id + " in coordinates " + JSON.stringify(coordinates) + " and max distance " + maxDistance)
                const eventsInRegion: Event[] = await this.eventRepository.getNewEventsForAppuser(appuser_id, myPlace.region, myPlace.country);

                console.log("region: " + myPlace.region)
                console.log(eventsInRegion)
                if (eventsInRegion.length > 0) {
                    const eventsWithinRange: Event[] = eventsInRegion.filter((eventDB) => {
                        return rightDistance(eventDB, myPlace, maxDistance)
                    }
                    )
                    console.log("events within range: " + maxDistance + "km");
                    console.log(eventsWithinRange)
                    eventsWithinRange.sort((a, b) =>
                        (a.distance! > b.distance!) ? 1 : -1 //asertion that its not null
                    )
                    return eventsWithinRange;
                }
            }
        } catch (err) {
            console.error(err);
        }
        return [];

    }

    async getEventsAppuserLikes(appuser_id: number): Promise<Event[]> {

        return await this.eventRepository.getEventsAppuserLikes(appuser_id);
    }


    async getEventById(id: number): Promise<Event | null> {
        return this.eventRepository.getEventById(id);
    }

    async getEventsWithinRange(maxDistance: number, coordinates: Coordinates): Promise<Event[]> {

        try {
            const myPlace: Place | null = await getPlaceByCoordinates(coordinates);

            if (myPlace) {
                const eventsInRegion: Event[] = await this.getEventsByRegion(myPlace.region, myPlace.country);
                console.log("events in region ")
                console.log(myPlace.region)
                console.log(eventsInRegion)
                if (eventsInRegion.length > 0) {
                    const eventsWithinRange: Event[] = eventsInRegion.filter((eventDB) => {
                        return rightDistance(eventDB, myPlace, maxDistance)
                    }
                    )
                    console.log("events within range: " + maxDistance + "km");
                    console.log(eventsWithinRange)
                    eventsWithinRange.sort((a, b) =>
                        (a.distance! > b.distance!) ? 1 : -1 //asertion that its not null
                    )
                    return eventsWithinRange;
                }
            }
        } catch (err) {
            console.error(err);
        }
        return [];
    }


    async getEventsByRegion(region: string, country: string): Promise<Event[]> {
        return await this.eventRepository.getEventsByRegion(region, country)
    }

    async setInteractionBetweenAppuserAndEvent(appuser_id: number, event_id: number, liked: boolean): Promise<Event | null> {
        try {
            const event: Event | null =
                await this.eventRepository.setInteractionBetweenAppuserAndEvent(appuser_id, event_id, liked);
            console.log("finished setting interaction");

            return event;
        } catch (err) {
            console.error(err)
        }
        return null;
    }

    async deleteAppuserEventInteraction(appuser_id: number, event_id: number): Promise<void> {
        try {
            await this.eventRepository.deleteAppuserEventInteraction(appuser_id, event_id);
        } catch (err) {
            console.error(err)
        }
    }

    async saveEvent(event: Event): Promise<Event | null> {

        try {
            const coordinates = await getCoordinates(event)
            if (coordinates) {
                event.latitude = coordinates.latitude;
                event.longitude = coordinates.longitude;

                return await this.eventRepository.saveEvent(event)
            }
        } catch (err) {
            console.error(err);
        }

        return null;

    }

    async deleteEvent(id: number): Promise<number> {
        await this.eventRepository.deleteEvent(id);
        return id;
    }

}

export { EventUsecases }