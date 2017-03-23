import { HL7Component } from './hl7Component';
import { Parser } from './parse';


export class HL7Field {
    private _hl7Components: HL7Component[] = [];
    private _hl7RepeatedFields: HL7Field[] = [];

    get hl7Components(): HL7Component[]{
        return this._hl7Components;
    }
    set hl7Components(components: HL7Component[]) {
        this._hl7Components = components;
    }

    get hl7RepeatedFields(): HL7Field[] {
        return this._hl7RepeatedFields;
    }
    set hl7RepeatedFields(repeatedFields: HL7Field[]) {
        this._hl7RepeatedFields = repeatedFields;
    }

    fieldDesc: string;
    hasRepetition: boolean = false;
    hasHL7Components: boolean = false;
    isInQuickView: boolean = false;

    constructor(public value: string, public index: number) {}
}
