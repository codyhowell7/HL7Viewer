import { HL7Component } from './hl7Component';
import { Parser } from './parse';


export class HL7Field {
    hl7Components: HL7Component[] = [];
    hl7RepeatedFields: HL7Field[] = [];
    fieldDesc: string;
    hasRepetition: boolean;
    hasHL7Components: boolean;
    isInQuickView: boolean = false;

    constructor(public value: string, private index: number) {}
}
