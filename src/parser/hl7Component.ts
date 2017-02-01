import { HL7SubComponent } from './hl7SubComponent';
import { Parser } from './parse';

export class HL7Component {
    HL7SubComponents: HL7SubComponent[] = [];
    Index: number;
    Value: string;
    HasSubComponents: boolean;
    isHighlighted: boolean;

    constructor(hl7Component: string, hl7ComponentIndex: number) {
        this.Value = hl7Component;
        this.Index = hl7ComponentIndex;
    }
}
