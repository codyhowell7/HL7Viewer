import { HL7Segment } from './hl7Segment';


export class HL7Message {
    hl7Segments: HL7Segment[] = [];
    hl7MessageType: string = '';
    hl7MessageControllerId: string = '';
    hl7MessageDateTime: Date = new Date();
    hl7Version: string = '';
    hl7MessageId: number = 0;
    hl7CorrectedMessage: string = '';

    constructor(private value: string) { }
}

