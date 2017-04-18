import { HL7Segment } from './hl7Segment';


export class HL7Message {
    private _hl7Segments: HL7Segment[] = [];

    get hl7Segments(): HL7Segment[]{
        return this._hl7Segments;
    }

    set hl7Segments(segments: HL7Segment[]){
        this._hl7Segments = segments;
    }

    hl7MessageType: string;
    hl7MessageControllerId: string;
    hl7MessageDateTime: Date;
    hl7Version: string;
    hl7MessageId: number;
    hl7CorrectedMessage: string;
    hl7MessageNoPHI = '';

    constructor(private value: string) { }
}

