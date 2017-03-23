import { HL7Message } from './hl7Message';
import { Parser } from './parse';

export class HL7MultiMessage {
    private _hl7Messages: HL7Message[] = [];

    constructor(hl7Fullmessage: string) {
        this.beginParse(hl7Fullmessage);
    }

    get hl7Messages(): HL7Message[] {
        return this._hl7Messages;
    }

    set hl7Messages(messages: HL7Message[]) {
        this._hl7Messages = messages;
    }

    private beginParse(hl7Fullmessage: string) {
        let messageParser;
        if (hl7Fullmessage != null && hl7Fullmessage !== '' && hl7Fullmessage.startsWith('MSH')) {
            let hl7MessageArray = hl7Fullmessage.split(/[\s](?=MSH)/);
            hl7MessageArray.forEach((element, index) => {
                messageParser = new Parser();
                this.hl7Messages.push(messageParser.parseHL7Message(element, index));
            });
        }
    }
}
