import { HL7Component } from './hl7Component';
import { Parser } from './parse';


export class HL7Field {
    hl7Components: HL7Component[] = [];
    hl7RepeatedFields: HL7Field[] = [];
    fieldDesc: string;
    hasRepetition: boolean = false;
    hasHL7Components: boolean = false;
    isInQuickView: boolean = false;

    constructor(public value: string, private index: number) {}
}
