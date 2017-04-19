import { HL7Message } from './hl7Message';
import { Parser } from './parse';
import { Map } from 'immutable';
import { IMessage } from '../app/states/states';


export class HL7MultiMessage {
    private _hl7Messages = Map<number, IMessage>();

    constructor(hl7Fullmessage: string, startingIndex: number) {
        this.beginParse(hl7Fullmessage, startingIndex);
    }

    get hl7Messages(): Map<number, IMessage> {
        return this._hl7Messages;
    }

    set hl7Messages(messages: Map<number, IMessage>) {
        this._hl7Messages = messages;
    }

    private beginParse(hl7Fullmessage: string, startingIndex) {
        let messageParser;
        let messages = Map<number, IMessage>().set(0, {id: 0, message: new HL7Message(''), deleted: false});
        if (hl7Fullmessage != null && hl7Fullmessage !== '' && hl7Fullmessage.startsWith('MSH')) {
            let hl7MessageArray = hl7Fullmessage.split(/[\s](?=MSH)/);
            hl7MessageArray.forEach((element, index) => {
                messageParser = new Parser();
                messages = messages.set(index + startingIndex, {
                    id: index + startingIndex,
                    message: messageParser.parseHL7Message(element, index + startingIndex),
                    deleted: false
                });
            });
        }
        this.hl7Messages = messages;
    }
}
