import { HL7Component } from './hl7Component';
import { Parser } from './parse';


export class HL7Field {
    HL7Components: HL7Component[] = [];
    HL7RepeatedFields: HL7Field[] = [];
    Index: number;
    Value: string;
    HasRepetition: boolean;
    HasHL7Components: boolean;
    isHighlighted: boolean;

    constructor(hl7Field: string, hl7FieldIndex: number) {
        this.Value = hl7Field;
        this.Index = hl7FieldIndex;
    }
}
