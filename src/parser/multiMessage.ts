import { HL7Message } from './message';
import { Parser } from './parse';

export class HL7MultiMessage {
    HL7Messages: HL7Message[] = [];
    isHighlighted: boolean;

    constructor(hl7Fullmessage: string) {
        let messageParser;
        if (hl7Fullmessage != null) {
            let hl7MessageArray = hl7Fullmessage.split(/[\s](?=MSH)/);
            hl7MessageArray.forEach(element => {
                messageParser = new Parser(element.substr(3, 5));
                this.HL7Messages.push(messageParser.hl7MessageParse(element));
            });
        }
    }
}
