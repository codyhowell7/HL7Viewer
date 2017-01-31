import {Message} from './message';
import { IHighlighted } from '../interfaces/IHighlighted';


export class MultiMessage implements IHighlighted {
Messages: Message[] = [];
isHighlighted: boolean;

    constructor(fullmessage: string) {
        this.Parse(fullmessage);
    }

    Parse(fullmessage: string) {
        let messageArray = fullmessage.split(/[\s](?=MSH)/);
        messageArray.forEach(element => {
            this.Messages.push(new Message(element));
        });
    }
}
