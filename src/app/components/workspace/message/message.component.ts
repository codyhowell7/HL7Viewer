import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Parser } from '../../../../parser/parse';
import { HL7MultiMessage } from '../../../../parser/hl7MultiMessage';
import { HL7Message } from '../../../../parser/HL7Message';
import { GetNextSegment } from '../../../services/get-next-segment-service';
import { GetNextField } from '../../../services/get-next-field-service';
import { GetNextComponent } from '../../../services/get-next-component-service';
import { Map } from 'immutable';
import 'rxjs/add/operator/debounceTime';

import { IMessage, IAppState } from '../../../states/states';
import { MESSAGE_RECEIVED, ADD_MESSAGE } from '../../../constants/constants';

@Component({
  selector: 'hls-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [GetNextSegment, GetNextField, GetNextComponent]
})
export class MessageComponent implements OnInit {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;

  messageId: number;
  message: string;
  messages: Map<number, IMessage>;
  messageControl: FormControl = new FormControl();

  constructor(private route: ActivatedRoute, private ngRedux: NgRedux<IAppState>,
    private getNextSegment: GetNextSegment, private getNextField: GetNextField,
    private getNextComponent: GetNextComponent) { }

  ngOnInit() {

    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        this.messageId = currentMessage;
        this.messages = messages;
        return messages.get(currentMessage);
      })
      .subscribe(message => { this.messageControl.setValue(message.message.hl7CorrectedMessage, {emitEvent: false}); });

    this.messageControl
      .valueChanges
      .debounceTime(200)
      .subscribe(value => {
        let parsedMessage = new HL7MultiMessage(this.message);
        parsedMessage.hl7Messages.forEach((message, messageIndexId) => {
          if (messageIndexId === 0) {
            this.ngRedux.dispatch({
              type: MESSAGE_RECEIVED,
              payload: {
                id: this.messageId,
                message: message
              }
            });
          } else {
            this.ngRedux.dispatch({
              type: ADD_MESSAGE,
              payload: {
                message: message
              }
            });
          }
        });
      this.getNextComponent.nextComponentOffset(this.messages);
      });

  }



}
