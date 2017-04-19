import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  NEW_SEARCH_MESSAGE, CREATE_DEAFULT_SEARCH_BY_SIZE, All_MESSAGE_RECEIVED
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
        if (this.currentMessage) {
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
                segmentID: segmentIndex,
                fieldID: -1,
                repeatID: -1,
                componentID: -1
              }
            });
          });
        }
        if (message) {
          this.message = message.message.hl7CorrectedMessage;
        };
      });

    this.mHighlightSub = this.messageHighlight$.subscribe(highlight => {
      this.highlight = highlight;
    });

    this.messageControl
      .valueChanges
      .subscribe(value => {
        if (this.messageId !== 0) {
          if (value != null) {
            let parsedMessage = new HL7MultiMessage(this.message, this.messageId).hl7Messages;
            parsedMessage.forEach((message, mIndex = 0) => {
              if (message.id !== 0) {

                this.ngRedux.dispatch({
                  type: NEW_SEARCH_MESSAGE,
                  payload: {
                    searchId: message.id
                  }
                });
                this.ngRedux.dispatch({
                  type: MESSAGE_RECEIVED,
                  payload: {
                    id: mIndex,
                    message: message.message
                  }
                });
              }
            });
          }
        } else {
          if (value != null) {
            let parsedMessage = new HL7MultiMessage(this.message, this.messageId).hl7Messages;

            this.ngRedux.dispatch({
              type: CREATE_DEAFULT_SEARCH_BY_SIZE,
              payload: {
                messageSize: parsedMessage.size
              }
            });

            this.ngRedux.dispatch({
              type: All_MESSAGE_RECEIVED,
              payload: {
                messages: parsedMessage
              }
            });
          }
        }
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
              segmentID: segmentIndex,
              fieldID: -1,
              repeatID: -1,
              componentID: -1
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
}
