import { Event } from "../../event/domain/Event";
import { Place } from "../../event/domain/Place";
import { Coordinates } from "../../event/domain/coordinates";

const getCoordinates = async (event: Event): Promise<Coordinates | null> => {
    let url = '';
    if (event.address) {
        url = `
        http://api.positionstack.com/v1/forward?access_key=${process.env.APIKEY}&query=${event.address}+${event.city}+${event.region}+${event.country}&output=json`

    } else {
        url = `
        http://api.positionstack.com/v1/forward?access_key=${process.env.APIKEY}&query=${event.city}+${event.region}+${event.country}&output=json`

    }


    try {
        const result: any = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resultJSON: any = await result.json();
        console.log(resultJSON);

        const coordinates: Coordinates = {
            latitude: resultJSON.data[0].latitude,
            longitude: resultJSON.data[0].longitude,
        }
        console.log(coordinates)

        return coordinates;

    } catch (err) {
        console.error(err)
    }

    return null;

}

const getPlaceByCoordinates = async (coordinates: Coordinates): Promise<Place | null> => {
    const url =
        `
        http://api.positionstack.com/v1/reverse?access_key=${process.env.APIKEY}&query=${coordinates.latitude},${coordinates.longitude}&output=json`

    try {
        console.log("(Start fetch):/context/positionStack/positionStackFetch/getPlceByCoordinates()");
        const result = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resultJSON: any = await result.json();



        const place: Place = {

            address: resultJSON.data[0].street + " " + resultJSON.data.number,
            city: resultJSON.data[0].administrative_area,
            region: resultJSON.data[0].region,
            country: resultJSON.data[0].country,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        }

        console.log("(place):/context/positionStack/positionStackFetch/getPlceByCoordinates()");
        console.log(place);
        console.log("(Finish fetch):/context/positionStack/positionStackFetch/getPlceByCoordinates()");
        return place;

    } catch (err) {
        console.error(err)
    }
    return null;
}

export { getCoordinates, getPlaceByCoordinates }