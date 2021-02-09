export const getEndOfDayTimeStampFromDate = (date) => {
    const dateCopy = new Date(date);
    // dateCopy.setDate(dateCopy.getDate() + 1);
     return dateCopy.setUTCHours(23,59,59,999)
}


