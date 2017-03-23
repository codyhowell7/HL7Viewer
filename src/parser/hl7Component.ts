import { HL7SubComponent } from './hl7SubComponent';
import { Parser } from './parse';

export class HL7Component {
    private _hl7SubComponents: HL7SubComponent[] = [];

    get hl7SubComponents(): HL7SubComponent[] {
        return this._hl7SubComponents;
    }

    set hl7SubComponents(subComponents: HL7SubComponent[]){
        this._hl7SubComponents = subComponents;
    }

    hasSubComponents: boolean = false;
    isInQuickView: boolean = false;

    constructor(public value: string, public index: number) {    }
}
