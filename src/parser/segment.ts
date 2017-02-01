import { HL7Field } from './field';
import { Parser } from './parse';

export class HL7Segment {
    HL7Fields: HL7Field[] = [];
    Value: string;
    Name: string;
    isHighlighted: boolean;

    constructor(hl7Segment: string, messageEncodingChars: string) {
        let hl7SegmentParser = new Parser();
        hl7SegmentParser.fieldParse(hl7Segment, this.HL7Fields, messageEncodingChars);
        this.Value = hl7Segment;
        this.Name = hl7Segment.substring(0, 3);
    }
}
