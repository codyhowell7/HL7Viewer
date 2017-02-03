import * as moment from 'moment';

export function ConvertTime(datetime: string) {
    try {
        return moment.utc(datetime, 'YYYYMMDDHHmm').toDate();

    } catch (e) {
        console.log(e);
    }
}
