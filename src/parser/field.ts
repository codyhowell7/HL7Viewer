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

    constructor(hl7Field: string, hl7FieldIndex: number, hl7SubFields: any[], repeat?: boolean) {
        this.Value = hl7Field;
        this.Index = hl7FieldIndex;
        if (repeat === true) {
            this.HL7Components = hl7SubFields;
        } else {
            this.HL7RepeatedFields = hl7SubFields;
        }
        this.HasRepetition = this.HL7RepeatedFields.length > 0;
        this.HasHL7Components = this.HL7Components.length > 0;
    }

}
