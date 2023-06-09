
interface Place {
    address: string;
    city: string;
    region: string;
    country: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
}

export { Place }