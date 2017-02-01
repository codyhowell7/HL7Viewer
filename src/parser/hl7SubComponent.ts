export class HL7SubComponent {
    Index: number;
    Value: string;
    isHighlighted: boolean;

    constructor(hl7SubComponent: string, hl7SubComponentIndex: number) {
        this.Value = hl7SubComponent;
        this.Index = hl7SubComponentIndex;
    }
}
