import { Event } from "../../domain/Event";
import { EventRepository } from "../../domain/Events.repository";
import executeQuery from "../../../_context/db/postgres.connector";
import { removeTimeStamp } from "../../../_context/dates/removeTimestamp";
class EventRepositoryPostgres implements EventRepository {


    async getEvents(): Promise<Event[]> {
        const query: string = ` SELECT * FROM events `;
        try {
            const eventsDB: any[] = await executeQuery(query);
            const events: Event[] = [];
            if (eventsDB.length > 0) {
                eventsDB.map((row: any) => {
                    const event: Event = {
                        id: Number(row.id),
                        appuser_id: Number(row.appuser_id),
                        name: row.name,
                        date: removeTimeStamp(row.date),
                        description: row.description,
                        address: row.address,
                        city: row.city,
                        region: row.region,
                        country: row.country,
                        latitude: Number(row.latitude),
                        longitude: Number(row.longitude),
                    }
                    events.push(event);
                });
            }
            return events;
        } catch (error) {
            console.error("Error getting all Events" + error);
        }
        return [];

    }

    async getEventsByRegion(region: string, country: string): Promise<Event[]> {
        const query = `SELECT * FROM events WHERE region LIKE '${region}' AND country LIKE '${country}'`
        const events: Event[] = []
        try {
            const eventsDB: any[] = await executeQuery(query)
            if (eventsDB.length > 0) {
                eventsDB.map((row: any) => {


                    const event: Event = {
                        id: Number(row.id),
                        appuser_id: Number(row.appuser_id),
                        name: row.name,
                        date: removeTimeStamp((row.date).toLocaleDateString()),
                        description: row.description,
                        address: row.address,
                        city: row.city,
                        region: row.region,
                        country: row.country,
                        latitude: Number(row.latitude),
                        longitude: Number(row.longitude),

                    }
                    events.push(event);
                })
            }

            return events;
        } catch (err) {
            console.error(`error getting events by region ${region} :\n` + err)
        }

        return [];
    }

    async getEventById(id: number): Promise<Event | null> {
        const query: string = `SELECT * FROM events WHERE id = ${id}`

        try {
            const eventsDB: any[] = await executeQuery(query);
            if (eventsDB.length > 0) {

                const event: Event = {
                    id: eventsDB[0].id,
                    appuser_id: eventsDB[0].appuser_id,
                    name: eventsDB[0].name,
                    date: removeTimeStamp(eventsDB[0].date),
                    description: eventsDB[0].description,
                    address: eventsDB[0].address,
                    city: eventsDB[0].city,
                    region: eventsDB[0].region,
                    country: eventsDB[0].country,
                    latitude: Number(eventsDB[0].latitude),
                    longitude: Number(eventsDB[0].longitude),

                }
                return event;
            }
        } catch (err) {
            console.error(`error getting event by  id ${id} \n${err}`)
        }
        return null;
    }
    async getAppuserEvents(appuser_id: number): Promise<Event[]> {
        try {
            const query = `SELECT * FROM events WHERE appuser_id = ${appuser_id}`

            const eventsDB: any[] = await executeQuery(query);

            const appuserEvents: Event[] = [];

            eventsDB.forEach(event => appuserEvents.push({
                id: Number(event.id),
                appuser_id: event.appuser_id,
                name: event.name,
                address: event.address,
                date: removeTimeStamp((event.date).toLocaleDateString()),
                description: event.description,
                city: event.city,
                region: event.region,
                country: event.country,
                latitude: event.latitude,
                longitude: event.longitude,

            }))

            return appuserEvents;


        } catch (err) {
            console.error(err);
            throw new Error("Couldn't get events for user " + appuser_id)
        }
        return [];

    }
    async getNewEventsForAppuser(appuser_id: number, region: string, country: string): Promise<Event[]> {
        const query = `
        SELECT * FROM events
         WHERE
             region = '${region}' AND 
             country = '${country}' AND
             appuser_id != ${appuser_id} AND
             id NOT IN (
             SELECT event_id 
             FROM appuser_event_interaction
             WHERE appuser_id = ${appuser_id}
            )
            `
        const eventsDB: any[] = await executeQuery(query)
        const events: Event[] = [];
        if (eventsDB.length > 0) {

            eventsDB.forEach((eventDB) => {
                events.push({
                    ...eventDB, date: removeTimeStamp((eventDB.date).toLocaleDateString())
                })
            })
            return events;
        }
        return []
    }
    async getEventsAppuserLikes(appuser_id: number): Promise<Event[]> {
        try {
            const query = `
             SELECT e.* , a.username FROM events AS e JOIN appusers AS a ON e.appuser_id = a.id WHERE e.id IN
             (
                 SELECT event_id 
                 FROM appuser_event_interaction 
                 WHERE appuser_id = ${appuser_id} AND attend = true)`
            const eventsDB: any[] = await executeQuery(query);
            const events: Event[] = [];
            if (eventsDB.length > 0) {

                eventsDB.forEach((eventDB) => {
                    events.push({
                        ...eventDB, date: removeTimeStamp((eventDB.date).toLocaleDateString())
                    })
                })
                return events
            } else {
                return []
            }

        } catch (err) {
            console.error(err)
        }
        return [];
    }

    async setInteractionBetweenAppuserAndEvent(appuser_id: number, event_id: number, liked: boolean): Promise<Event | null> {


        const query = `INSERT INTO appuser_event_interaction VALUES (${appuser_id},${event_id}, ${liked})`;
        console.log("query in interaction:" + query);

        try {
            await executeQuery(query);

            const queryFoEvent = `SELECT * FROM events WHERE id=${event_id}`;
            const eventDB: any[] = await executeQuery(queryFoEvent);
            const event: Event = {
                ...eventDB[0], date: removeTimeStamp((eventDB[0].date).toLocaleDateString())
            }
            return event
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    async deleteAppuserEventInteraction(appuser_id: number, event_id: number): Promise<void> {
        const query = `DELETE FROM appuser_event_interaction WHERE appuser_id = ${appuser_id} AND event_id = ${event_id}`
        try {
            await executeQuery(query)
        } catch (err) {
            console.error(err)
        }
    }
    async saveEvent(event: Event): Promise<Event> {
        const query: string =
            `
            INSERT INTO events 
            (appuser_id, name, date,description, address, city, region,country, latitude, longitude)
            VALUES
            (${event.appuser_id},'${event.name}','${event.date}','${event.description}','${event.address}','${event.city}','${event.region}','${event.country}',${event.latitude},${event.longitude})
            RETURNING id
            `


        try {
            const eventDB: any[] = await executeQuery(query);
            if (eventDB.length > 0) {
                const id: number = eventDB[0].id
                event.id = id;
            }
        } catch (err) {
            throw new Error(`error saving event:\n${JSON.stringify(event)} in repo\n
            err:${err}`)
        }
        console.log("saved:")
        console.log(event)
        return event;
    }
    async deleteEvent(id: number): Promise<void> {
        const query: string = `DELETE FROM events WHERE id = ${id}`

        try {
            await executeQuery(query)
        } catch (err) {
            console.error(`error deleting by id ${id}:\n${err}`)
        }

    }

}

export { EventRepositoryPostgres }
