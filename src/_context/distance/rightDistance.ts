import { Event } from "../../event/domain/Event"
import { Place } from "../../event/domain/Place";

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}
const rightDistance = (event1: Event, myPlace: Place, maxDistance: number): boolean => {

    try {
        if (event1.latitude && event1.longitude && myPlace.latitude && myPlace.longitude) {
            const distanceInKm: number = getDistanceFromLatLonInKm(event1.latitude, event1.longitude, myPlace.latitude, myPlace.longitude)
            console.log(`Distance between ${event1.city} and ${myPlace.city} is ${distanceInKm}`)
            if (distanceInKm <= maxDistance) {
                console.log("true")
                event1.distance = Math.round(distanceInKm);
                return true;
            } else {
                console.log("false")
                return false;
            }
        }
    } catch (err) {
        console.error(err);
    }

    return false;
}

export { rightDistance }