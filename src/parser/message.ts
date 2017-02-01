import { HL7Segment } from './segment';
import { ConvertTime } from './convertTime';
import { Parser } from './parse';
import * as moment from 'moment';


export class HL7Message {
    HL7Segments: HL7Segment[] = [];
    HL7MessageType: string;
    HL7MessageControllerId: string;
    HL7MessageDateTime: Date;
    isHighlighted: boolean;

    constructor(hl7Message: string, hl7Segments: HL7Segment[]) {
        this.HL7Segments = hl7Segments;
        if (this.HL7Segments.length > 0 && this.HL7Segments[0].Name === 'MSH') {
            this.HL7MessageType = this.HL7Segments[0].HL7Fields[8].Value;
            this.HL7MessageControllerId = this.HL7Segments[0].HL7Fields[9].Value;
            this.HL7MessageDateTime = ConvertTime(this.HL7Segments[0].HL7Fields[6].Value);
        }
    }
}
