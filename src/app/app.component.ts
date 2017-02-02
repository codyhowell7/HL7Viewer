import { Component } from '@angular/core';
import { HL7Message } from '../parser/hl7Message';
import { Parser } from '../parser/parse';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    strHL7Messages: string;
    hl7Messages: HL7Message[] = [];


    parse() {
        this.parseHl7Messages(this.strHL7Messages);
        console.log(this.hl7Messages);
    }

    private parseHl7Messages(hl7Messages: string) {
        this.hl7Messages = [];
        let messageParser;
        let hl7MessageArray = hl7Messages.split(/[\s](?=MSH)/);
        hl7MessageArray.forEach(messageElement => {
            messageParser = new Parser();
            this.hl7Messages.push(messageParser.parseHL7Message(messageElement));
        });
    }

}
