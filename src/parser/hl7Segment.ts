import { HL7Field } from './hl7Field';
import { Parser } from './parse';

export class HL7Segment {
    hl7Fields: HL7Field[] = [];
    segmentName: string;
    segmentDesc: string;
    isInQuickView: boolean = false;

    constructor(public value: string, public segmentIndex: number) { }
}
