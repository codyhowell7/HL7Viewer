import { HL7Segment } from './segment';
import { ConvertTime } from './convertTime';
import { Parser } from './parse';
import * as moment from 'moment';


export class HL7Message {
    HL7Segments: HL7Segment[] = [];
    HL7MessageType: string;
    HL7MessageControllerId: string;
    HL7MessageDateTime: Date;
    messageEncodingChars: string;
    isHighlighted: boolean;

    constructor(hl7Message: string) {
        if (hl7Message.substr(0, 3) === 'MSH') { // TODO: Run message through validation before parsing.
            this.messageEncodingChars = hl7Message.substr(3, 5);
            let hl7MessageParser = new Parser();
            hl7MessageParser.segmentParse(hl7Message, this.messageEncodingChars, this.HL7Segments);
            if (this.HL7Segments.length > 0 && this.HL7Segments[0].Name === 'MSH') {
                this.HL7MessageType = this.HL7Segments[0].HL7Fields[8].Value;
                this.HL7MessageControllerId = this.HL7Segments[0].HL7Fields[9].Value;
                this.HL7MessageDateTime = ConvertTime(this.HL7Segments[0].HL7Fields[6].Value);
            }
        }
    }
}
