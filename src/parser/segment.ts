import { HL7Field } from './field';
import { Parser } from './parse';

export class HL7Segment {
    HL7Fields: HL7Field[] = [];
    Value: string;
    Name: string;
    isHighlighted: boolean;

    constructor(hl7Segment: string, hl7Fields: HL7Field[]) {
        this.Value = hl7Segment;
        this.Name = hl7Segment.substring(0, 3);
        this.HL7Fields = hl7Fields;
    }
}
