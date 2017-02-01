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

    constructor(hl7Field: string, hl7FieldIndex: number, messageEncodingChars: string) {
        this.Value = hl7Field;
        this.Index = hl7FieldIndex;
        let hl7FieldParser = new Parser();
        hl7FieldParser.hl7ComponentParse(hl7Field, hl7FieldIndex, messageEncodingChars, this.HL7RepeatedFields, this.HL7Components);
        this.HasRepetition = this.HL7RepeatedFields.length > 0;
        this.HasHL7Components = this.HL7Components.length > 0;
    }

}
