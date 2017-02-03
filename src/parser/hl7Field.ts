import { HL7Component } from './hl7Component';
import { Parser } from './parse';


export class HL7Field {
    hl7Components: HL7Component[] = [];
    hl7RepeatedFields: HL7Field[] = [];
    hasRepetition: boolean;
    hasHL7Components: boolean;
    isHighlighted: boolean;

    constructor(public value: string, private index: number) {}
}
