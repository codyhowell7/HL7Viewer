import { HL7Message } from './message';
import { Parser } from './parse';

export class HL7MultiMessage {
    HL7Messages: HL7Message[] = [];
    isHighlighted: boolean;

    constructor(hl7Fullmessage: string) {
        if (hl7Fullmessage != null) {
            let hl7MultiMessageParser = new Parser();
            hl7MultiMessageParser.messageParse(hl7Fullmessage, this.HL7Messages);
        }
    }
}
