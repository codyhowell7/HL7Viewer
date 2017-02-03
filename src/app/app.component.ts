import { Component } from '@angular/core';
import { HL7Message } from '../parser/hl7Message';
import { HL7MultiMessage } from '../parser/hl7MultiMessage';
import { Parser } from '../parser/parse';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    strHL7Messages: string;

    parse() {
        let messages = new HL7MultiMessage(this.strHL7Messages);
        console.log(messages.hl7Messages);
    }
}
