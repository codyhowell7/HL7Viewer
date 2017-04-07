import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Parser } from '../../../../parser/parse';
import { HL7MultiMessage } from '../../../../parser/hl7MultiMessage';
import { HL7Message } from '../../../../parser/HL7Message';
import { HL7Segment } from '../../../../parser/hl7Segment';
import { Map } from 'immutable';
import { IMessageHighlight } from '../../../states/states';

import { IMessage, IAppState, IAccordion, ISegmentAccordion } from '../../../states/states';
import {
  MESSAGE_RECEIVED, ADD_MESSAGE, DEFAULT_SEGMENT_ACCORDIONS, DEFAULT_MESSAGE_ACCORDIONS,
  NEW_SEARCH_MESSAGE
} from '../../../constants/constants';

@Component({
  selector: 'hls-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['accordion']) accordion$: Observable<IAccordion>;
  @select(['messageHighlight']) messageHighlight$: Observable<Map<string, IMessageHighlight>>;

  messageId: number;
  message: string;
  messages: Map<number, IMessage>;
  currentMessage: IMessage;
  messagesSize: number;
  messageControl: FormControl = new FormControl();
  highlight: Map<string, IMessageHighlight>;
  ifAnychanges;
  mHighlightSub;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
      this.ifAnychanges = combineLatest(this.accordion$,
        combineLatest(this.messages$, this.currentMessage$)
          .map(([messages, currentMessage]) => {
            this.messageId = currentMessage;
            this.messages = messages;
            this.currentMessage = messages.get(currentMessage);
            return messages.get(currentMessage);
          })
    )
      .subscribe(([accordion, message]) => {
        let hl7Segments: HL7Segment[];
        if (this.messages.get(this.messageId)) {
          hl7Segments = this.messages.get(this.messageId).message.hl7Segments;
        } else {
          hl7Segments = this.messages.get(0).message.hl7Segments;
        }
        if (!accordion.segment.has(this.messageId)) {
          this.ngRedux.dispatch({
            type: DEFAULT_MESSAGE_ACCORDIONS,
            payload: {
              messageID: this.messageId,
            }
          });
          hl7Segments.forEach((segment, segmentIndex) => {
            this.ngRedux.dispatch({
              type: DEFAULT_SEGMENT_ACCORDIONS,
              payload: {
                messageID: this.messageId,
                segmentID: segmentIndex
              }
            });
          });
        }
        if (message) {
          this.message = message.message.hl7CorrectedMessage;
        };
      });

    this.mHighlightSub  = this.messageHighlight$.subscribe(highlight => {
      this.highlight = highlight;
    });

    this.messageControl
      .valueChanges
      .subscribe(value => {
        let parsedMessage = new HL7MultiMessage(this.message);
        let messages: HL7Message[] = parsedMessage.hl7Messages;
        messages.forEach((message, messageIndexId) => {
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
            this.ngRedux.dispatch({
              type: NEW_SEARCH_MESSAGE
            });
          }
        });
        let hl7Segments: HL7Segment[];
        if (this.messages.get(this.messageId)) {
          hl7Segments = this.messages.get(this.messageId).message.hl7Segments;
        } else {
           hl7Segments = this.messages.get(0).message.hl7Segments;
        }
        hl7Segments.forEach((segment, segmentIndex) => {
          this.ngRedux.dispatch({
            type: DEFAULT_SEGMENT_ACCORDIONS,
            payload: {
              messageID: this.messageId,
              segmentID: segmentIndex
            }
          });
        });
      });
  }

  ngOnDestroy() {
    this.ifAnychanges.unsubscribe();
    this.mHighlightSub.unsubscribe();
  }

  lockText() {
    return this.message && this.currentMessage.message.hl7CorrectedMessage !== '';
  }


  makeColorful(segment: string) {
    let colorPipe = segment.replace('|', '<mark>|</mark>');
    return colorPipe;
  }
}
