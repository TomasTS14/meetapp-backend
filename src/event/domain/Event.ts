

interface Event {
    id?: number,
    appuser_id: number,
    appuser_username? : string,
    name: string,
    date: Date | string,
    description: string,
    address: string,
    city?: string,
    region?: string,
    country?: string,
    latitude?: number,
    longitude?: number,
    distance?: number,
}

export { Event }
