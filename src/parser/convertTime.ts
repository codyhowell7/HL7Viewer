import * as moment from 'moment';

export function ConvertTime(datetime: string) {
    try {
        let FormattedDate = moment.utc(datetime, 'YYYYMMDDHHmm').toDate();

        return FormattedDate;
    } catch (e) {
        console.log(e);
    }
}
