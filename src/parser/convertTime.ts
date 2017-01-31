
export function ConvertTime(datetime: string) {
    try {
        let FormattedDate = new Date();
        let OffsetUTC = FormattedDate.getTimezoneOffset() / 60; // Convert UTC time difference into hours
        FormattedDate.setFullYear(Number(datetime.substr(0, 4)));
        FormattedDate.setMonth(Number(datetime.substr(4, 2)) - 1);
        FormattedDate.setDate(Number(datetime.substr(6, 2)));
        FormattedDate.setHours(Number(datetime.substr(8, 2)) - OffsetUTC); // Account for UTC time difference
        FormattedDate.setMinutes(Number(datetime.substr(10, 2)));
        FormattedDate.setSeconds(0);
        FormattedDate.setMilliseconds(0);
        return FormattedDate;
    } catch (e) {
        console.log(e);
    }
}