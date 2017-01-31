import {Message} from './message';

export class MultiMessage {
Messages: Message[] = [];

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
