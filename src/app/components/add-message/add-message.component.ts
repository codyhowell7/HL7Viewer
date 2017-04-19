import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hls-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent implements OnInit {

  addMessageScreen = false;

  constructor() { }

  ngOnInit() {
  }

  addMessage() {
    this.addMessageScreen = true;
  }

}
