import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hls-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent implements OnInit {

  @Input() isMessages: boolean;
  @Input() fileLoaded: boolean;
  @Input() messagesSize: number;

  constructor() { }

  ngOnInit() {
  }

}
