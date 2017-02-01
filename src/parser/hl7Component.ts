import { HL7SubComponent } from './hl7SubComponent';
import { Parser } from './parse';

export class HL7Component {
    HL7SubComponents: HL7SubComponent[] = [];
    Index: number;
    Value: string;
    HasSubComponents: boolean;
    isHighlighted: boolean;

    constructor(hl7Component: string, hl7ComponentIndex: number, messageEncodingChars: string) {
        let hl7ComponentParser = new Parser();
        hl7ComponentParser.hl7SubComponentParse(hl7Component, hl7ComponentIndex, messageEncodingChars, this.HL7SubComponents);
        this.Value = hl7Component;
        this.Index = hl7ComponentIndex;
        this.HasSubComponents = this.HL7SubComponents.length > 1;
    }
}
