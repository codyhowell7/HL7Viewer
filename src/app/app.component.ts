import { Component } from '@angular/core';
import { MultiMessage } from '../parser/multiMessage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rawHL7: string;
  msg: MultiMessage;

   Parse() {
     this.msg = new MultiMessage(this.rawHL7);
     console.log(this.msg);
   }
}
