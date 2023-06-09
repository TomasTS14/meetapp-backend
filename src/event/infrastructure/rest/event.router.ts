
import express, { Request, Response } from 'express';
import { Event } from '../../domain/Event';
import { EventRepository } from '../../domain/Events.repository';
import { EventRepositoryPostgres } from '../db/event.repository.postgtres';
import { EventUsecases } from '../../application/event.usecases';
import { Coordinates } from '../../domain/coordinates';
import { isAdmin, isAuth } from '../../../_context/security/auth';


const router = express.Router();
const eventRepository: EventRepository = new EventRepositoryPostgres();
const eventUsecases: EventUsecases = new EventUsecases(eventRepository);

router.get("/", async (req: Request, res: Response) => {
    try {
        res.send("welcome to EventAPI")
    } catch (err) {
        res.send(`error reaching EventAPI`)
    }
})

router.get("/all", isAuth, isAdmin, async (req: Request, res: Response) => {
    try {
        const event: Event[] = await eventUsecases.getEvents()
        res.json(event)
    } catch (err) {
        res.send(err)
    }
})

router.get("/my_events", isAuth, async (req: Request, res: Response) => {
    try {
        if (req.body.auth) {
            console.log(req.body.auth);

            const appuser_id = Number(req.body.auth.id);
            const events: Event[] = await eventUsecases.getAppuserEvents(appuser_id)
            console.log(events);

            res.status(200).json(events)
        } else {
            throw new Error("No authentication")
        }

    } catch (err) {
        res.send(err)
    }
})

router.get("/near_me", isAuth, async (req: Request, res: Response) => {
    try {

        console.log("event.router=>/near_me:query");
        console.log(req.query);
        const maxDistance = Number(req.query.maxdistance);
        const latitude = Number(req.query.latitude);
        const longitude = Number(req.query.longitude);
        const coordinates: Coordinates = {
            latitude: latitude,
            longitude: longitude
        }

        const eventsNearMe: Event[] = await eventUsecases.getNewEventsForAppuser(req.body.auth.id, maxDistance, coordinates)
        res.json(eventsNearMe);
    } catch (err) {
        res.send("couldn't get events near me \n" + err)
    }
})

router.get("/liked", isAuth, async (req: Request, res: Response) => {
    try {
        console.log("/liked");

        const appuser_id: number = Number(req.body.auth.id)
        const events: Event[] = await eventUsecases.getEventsAppuserLikes(appuser_id)
        console.log(events);

        res.status(200).json(events)

    } catch (err) {
        res.status(500).send(err);
    }
})

router.get("/region/:country/:region", isAuth, isAdmin, async (req: Request, res: Response) => {
    try {
        if (req.params.region) {
            const Event: Event[] = await eventUsecases.getEventsByRegion(req.params.region, req.params.country)
            res.json(Event)
        }
    } catch (err) {
        res.send(err);
    }
})

router.get("/:id", isAuth, async (req: Request, res: Response) => {
    try {
        console.log("getting by id " + req.params.id);

        const id: number = Number.parseInt(req.params.id);
        const event: Event | null = await eventUsecases.getEventById(id);
        res.json(event)
    } catch (err) {
        res.send("error getting by id " + req.params.id)
    }
})


router.post("/interaction/:id", isAuth, async (req: Request, res: Response) => {
    console.log("interaction");

    try {
        if (!!req.params.id && !!req.query.liked) {
            const event_id: number = Number(req.params.id);
            const liked = req.query.liked === "true" ? true : false;
            const appuser_id = req.body.auth.id;
            console.log("inside interaction router");


            const event: Event | null = await eventUsecases.setInteractionBetweenAppuserAndEvent(appuser_id, event_id, liked);

            if (!!event) {
                res.status(201).json(event)
            } else {
                res.status(500).send("Interaction failed")
            }
        } else {
            res.status(400).send("Missing param liked or event id from request")
        }

    } catch (err) {
        res.status(500).send(err);
    }

})

router.delete("/interaction/:id", isAuth, async (req: Request, res: Response) => {
    try {
        if (!!req.params.id) {
            const event_id: number = Number(req.params.id);
            const appuser_id = req.body.auth.id;
            console.log("inside interaction router");

            await eventUsecases.deleteAppuserEventInteraction(appuser_id, event_id);

            res.status(200).send("Interaction deleted")
        } else {
            res.status(400).send("Missing event id from request")
        }

    } catch (err) {
        res.status(500).send(err);
    }
})

router.post("/save", isAuth, async (req: Request, res: Response) => {
    const appuser_id: number = req.body.auth.id;
    console.log("adding event\n")
    console.log(req.body.event)
    try {
        if (req.body.event) {
            const event = req.body.event;
            const eventToAdd: Event = {
                appuser_id: appuser_id,
                name: event.name,
                date: event.date,
                description: event.description,
                address: event.address,
                city: event.city,
                region: event.region,
                country: event.country,
            }

            const eventSaved: Event | null = await eventUsecases.saveEvent(eventToAdd)

            console.log("event posted")

            res.json(eventSaved);
        }
    } catch (err) {
        res.send(err);
    }
})

router.delete("/delete/:id", isAuth, async (req: Request, res: Response) => {

    try {
        console.log("deleting by id " + req.params.id);
        console.log(req.body.auth.id);
        console.log(req.params.id);



        await eventUsecases.deleteEvent(Number(req.params.id))
        res.status(200).send("deleted")
    } catch (err) {
        res.send(err)
    }
})

export { router as eventRouter }