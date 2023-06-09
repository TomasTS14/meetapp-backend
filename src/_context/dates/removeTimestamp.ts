

export const removeTimeStamp = (dateWithTimeStamp: string): string => {
    console.log("dateWithTimeStamp: " + dateWithTimeStamp);

    const date: string = dateWithTimeStamp.toString().slice(0, 11);

    return date;
}