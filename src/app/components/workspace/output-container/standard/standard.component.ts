import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';

import { IMessage, IAppState } from '../../../../states/states';
import { TOGGLE_ACCORDION, DEFAULT_ACCORDIONS_MESS, DEFAULT_ACCORDIONS_SEGS } from '../../../../constants/constants';


@Component({
  selector: 'hls-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {

  message: IMessage;
  theState: boolean;

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['accordion']) accordion$: Observable<Map<number, Map<number, boolean>>>;

  constructor(private ngRedux: NgRedux<IAppState>) { }


  ngOnInit() {
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        this.ngRedux.dispatch({
          type: DEFAULT_ACCORDIONS_MESS,
          payload: {
            messageID: messages.size - 1,
          }
        });

        return messages.get(currentMessage);
      })
      .subscribe(message => { this.message = message; });
  }

  getSegments() {
      this.message.message.hl7Segments.forEach((segment, segmentIndex) => {
        this.ngRedux.dispatch({
          type: DEFAULT_ACCORDIONS_SEGS,
          payload: {
            messageID: this.message.id,
            segmentID: segmentIndex
          }
        });
      });
      return this.message.message.hl7Segments;
  }

  getFields(segmentIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields;
  }

  getComponents(segmentIndex: number, fieldIndex: number) {
     return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components;
  }

  getState(segmentId: number) {
    let state;
    this.accordion$.subscribe(accordionSegmentState => state = accordionSegmentState.get(this.message.id).get(segmentId));
    return state;
  }

  extendAccordion(segmentIndex: number, state: boolean) {
    this.ngRedux.dispatch({
      type: TOGGLE_ACCORDION,
      payload: {
        id: this.message.id,
        messageID: this.message.id,
        segmentID: segmentIndex,
        toggleState: state
      }
    });
  }
}
