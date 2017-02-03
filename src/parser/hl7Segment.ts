import { HL7Field } from './hl7Field';
import { Parser } from './parse';
import { List } from 'linqts';

export class HL7Segment {
    hl7Fields: HL7Field[] = [];
    segmentName: string;
    isHighlighted: boolean;

    constructor(private value: string) { }
}
