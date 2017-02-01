import { Component } from '@angular/core';
import { HL7MultiMessage } from '../parser/multiMessage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rawHL7: string;
  msg: HL7MultiMessage;

   Parse() {
     this.msg = new HL7MultiMessage(this.rawHL7);
     console.log(this.msg.HL7Messages);
   }
}
