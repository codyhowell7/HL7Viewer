import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { GetNextSegment } from '../../../../services/get-next-segment-service';
import { GetNextField } from '../../../../services/get-next-field-service';
import { IMessage, IAppState } from '../../../../states/states';
import { TOGGLE_ACCORDION, DEFAULT_ACCORDIONS, TOGGLE_FIELD_ACCORDION, DEFAULT_FIELD_ACCORDIONS } from '../../../../constants/constants';


@Component({
  selector: 'hls-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  providers: [GetNextSegment, GetNextField]
})
export class StandardComponent implements OnInit {

  message: IMessage;
  theState: boolean;

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['accordion']) accordion$: Observable<Map<number, Map<number, boolean>>>;
  @select(['fieldAccordion']) fieldAccordion$: Observable<Map<number, Map<number, boolean>>>;

  constructor(private ngRedux: NgRedux<IAppState>, private getNextSegment: GetNextSegment, private getNextField: GetNextField) { }


  ngOnInit() {
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        let segmentOffset = this.getNextSegment.findSegmentOffset(currentMessage);
        messages.get(currentMessage).message.hl7Segments.forEach((segment, segmentIndex) => {
          this.ngRedux.dispatch({
            type: DEFAULT_ACCORDIONS,
            payload: {
              messageID: currentMessage,
              segmentID: segmentIndex + segmentOffset
            }
          });
          let fieldOffset = this.getNextField.findFieldOffset(segmentIndex);
          segment.hl7Fields.forEach((field, fieldIndex) => {
            this.ngRedux.dispatch({
              type: DEFAULT_FIELD_ACCORDIONS,
              payload: {
                segmentID: segmentIndex + segmentOffset,
                fieldID: fieldIndex + fieldOffset
              }
            });
          });
        });
        return messages.get(currentMessage);
      })
      .subscribe(message => { this.message = message; });
  }

  getSegments() {
    // this.message.message.hl7Segments.forEach((segment) => {
    //   this.ngRedux.dispatch({
    //     type: DEFAULT_ACCORDIONS_SEGS,
    //     payload: {
    //       messageID: this.message.id,
    //       segmentID: this.getNextSegment.nextSegmentId()
    //     }
    //   });
    // });
    return this.message.message.hl7Segments;
  }

  getFields(segmentIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields;
  }

  getComponents(segmentIndex: number, fieldIndex: number) {
    if ( this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hasHL7Components ) {
      return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hl7Components;
    } else {
      return;
    }
  }

  getSegmentState(segmentId: number) {
    let state;
    let messages;
    this.messages$.subscribe(messagesFromObserve => messages = messagesFromObserve);
    this.accordion$.subscribe(accordionSegmentState => state =
      accordionSegmentState.get(this.message.id).get(this.getNextSegment.findSegmentOffset(this.message.id) + segmentId));
    return state;
  }

  extendAccordion(segmentIndex: number, segmentAccoridonState: boolean) {
    this.ngRedux.dispatch({
      type: TOGGLE_ACCORDION,
      payload: {
        id: this.message.id,
        messageID: this.message.id,
        segmentID: this.getNextSegment.findSegmentOffset(this.message.id) + segmentIndex,
        toggleState: segmentAccoridonState
      }
    });
  }

  getFieldState(segmentId: number, fieldId: number) {
    let messages;
    let state;
    let correctedSegmentId = this.getNextSegment.findSegmentOffset(this.message.id);
    let correctedFieldId = this.getNextField.findFieldOffset(segmentId + correctedSegmentId);
    this.messages$.subscribe(messagesFromObserve => messages = messagesFromObserve);
    this.fieldAccordion$.subscribe(accordionFieldState => {  return state =
      accordionFieldState.get(segmentId + correctedSegmentId ).get(fieldId + correctedFieldId)});
    return state;
  }


  extendFieldAccordion(segmentId: number, fieldId: number, fieldAccordionState: boolean) {
    let segmentOffset = this.getNextSegment.findSegmentOffset(this.message.id);
    let fieldOffset = this.getNextField.findFieldOffset(segmentId + segmentOffset);
    this.ngRedux.dispatch({
      type: TOGGLE_FIELD_ACCORDION,
      payload: {
        segmentID: segmentId + segmentOffset,
        fieldID: fieldId + fieldOffset,
        toggleState: fieldAccordionState
      }
    });
  }
}
