import { Component } from '@angular/core';
import { HL7MultiMessage } from '../parser/hl7MultiMessage';
import { Parser } from '../parser/parse';
import { MessageReader } from '../messageReader/messageReader'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    strHL7Messages: string;

    parse() {
        let messages = new HL7MultiMessage(this.strHL7Messages);
        let mReader = new MessageReader;
        mReader.setQuickView(messages.hl7Messages, ['PID.5.1.1'] );
        console.log(mReader.specificDesignatorSearch(messages.hl7Messages, 'FGH'));
        console.log(messages.hl7Messages);
    }
}
