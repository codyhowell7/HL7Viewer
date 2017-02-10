import { HL7Message } from './hl7Message';
import { Parser } from './parse';

export class HL7MultiMessage {
    hl7Messages: HL7Message[] = [];

    constructor(hl7Fullmessage: string) {
        this.beginParse(hl7Fullmessage);
    }

    private beginParse(hl7Fullmessage: string) {
        let messageParser;
        if (hl7Fullmessage != null && hl7Fullmessage !== '') {
            let hl7MessageArray = hl7Fullmessage.split(/[\s](?=MSH)/);
            hl7MessageArray.forEach((element, index) => {
                messageParser = new Parser();
                this.hl7Messages.push(messageParser.parseHL7Message(element, index));
            });
        }
    }
}
