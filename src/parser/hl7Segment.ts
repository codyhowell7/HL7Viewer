import { HL7Field } from './hl7Field';
import { Parser } from './parse';

export class HL7Segment {
    private _hl7Fields: HL7Field[] = [];

    get hl7Fields(): HL7Field[] {
        return this._hl7Fields;
    }

    set hl7Fields(fields: HL7Field[]) {
        this._hl7Fields = fields;
    }

    segmentName: string;
    segmentDesc: string;
    segmentSetId: number;
    isInQuickView: boolean = false;

    constructor(public value: string, public segmentIndex: number) { }
}
