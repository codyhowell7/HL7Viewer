import { HL7SubComponent } from './hl7SubComponent';
import { Parser } from './parse';

export class HL7Component {
    hl7SubComponents: HL7SubComponent[] = [];
    hasSubComponents: boolean;
    isInQuickView: boolean = false;

    constructor(private value: string, private index: number) {    }
}
