import { HL7Field } from './field';
import { Parser } from './parse';

export class HL7Segment {
    HL7Fields: HL7Field[] = [];
    Value: string;
    Name: string;
    isHighlighted: boolean;

    constructor(hl7Segment: string) {
        this.Value = hl7Segment;
    }
}
