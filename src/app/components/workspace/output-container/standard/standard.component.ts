import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IMessage, IAppState, IAccordion } from '../../../../states/states';
import {
  TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
  DEFAULT_FIELD_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_COMPONENT_ACCORDIONS
} from '../../../../constants/constants';


@Component({
  selector: 'hls-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {

  message: IMessage;
  messageId: number;
  theState: boolean;

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['accordion']) accordion$: Observable<IAccordion>;

  constructor(private ngRedux: NgRedux<IAppState>) { }


  ngOnInit() {
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        let message = messages.get(currentMessage);
        this.messageId = currentMessage;
        return message;
      })
      .subscribe(message => { this.message = message; });
  }

  getSegments() {
    return this.message.message.hl7Segments;
  }

  getFields(segmentIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields;
  }

  getComponents(segmentIndex: number, fieldIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components) {
      return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components;
    } else {
      return;
    }
  }

  getSubComponents(segmentIndex: number, fieldIndex: number, componentIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components) {
      if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components[componentIndex - 1].hasSubComponents) {
        return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components[componentIndex - 1].hl7SubComponents;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  getSegmentState(segmentId: number): boolean {
    let state;
    this.accordion$.subscribe(accordionSegmentState => {
      if (accordionSegmentState.segment.get(this.message.id).get(segmentId) != null) {
        state = accordionSegmentState.segment.get(this.message.id).get(segmentId).segmentAccordionState;
      } else {
        state = false;
      }
    });
    return state;
  }

  extendSegmentAccordion(segmentIndex: number, segmentAccoridonState: boolean): void {
    this.ngRedux.dispatch({
      type: TOGGLE_SEGMENT_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentIndex,
        segmentToggleState: segmentAccoridonState
      }
    });
    this.accordion$.subscribe(accordionState => {
      this.message.message.hl7Segments[segmentIndex].hl7Fields.forEach((field, fieldIndex) => {
        this.ngRedux.dispatch({
          type: DEFAULT_FIELD_ACCORDIONS,
          payload: {
            messageID: this.messageId,
            segmentID: segmentIndex,
            fieldID: fieldIndex,
            segmentToggleState: accordionState.segment.get(this.messageId).get(segmentIndex).segmentAccordionState
          }
        });
      });
    }).unsubscribe();
  }

  getFieldState(segmentId: number, fieldId: number) {
    let state;
    this.accordion$.subscribe(accordionFieldState => {
      if (accordionFieldState.segment.get(this.message.id).get(segmentId).field.get(fieldId) != null) {
        state = accordionFieldState.segment.get(this.message.id).get(segmentId).field.get(fieldId).fieldAccordionState;
      } else {
        state = false;
      }
    }).unsubscribe();
    return state;
  }

  extendFieldAccordion(segmentId: number, fieldId: number, fieldAccordionState: boolean) {
    this.ngRedux.dispatch({
      type: TOGGLE_FIELD_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentId,
        fieldID: fieldId,
        fieldToggleState: fieldAccordionState,
        segmentToggleState: true
      }
    });

    this.accordion$.subscribe(accordionFieldState => {
      this.message.message.hl7Segments[segmentId].hl7Fields[fieldId].hl7Components.forEach((component, componentIndex) => {
        this.ngRedux.dispatch({
          type: DEFAULT_COMPONENT_ACCORDIONS,
          payload: {
            messageID: this.messageId,
            segmentID: segmentId,
            fieldID: fieldId,
            componentID: componentIndex,
            segmentToggleState: accordionFieldState.segment.get(this.messageId).get(segmentId).segmentAccordionState,
            fieldToggleState: accordionFieldState.segment.get(this.messageId).get(segmentId).field.get(fieldId).fieldAccordionState,
          }
        });
      });
    }).unsubscribe();
  }

  getComponentState(segmentId: number, fieldId: number, componentId: number) {
    let state;
    this.accordion$.subscribe(accordionComponentState => {
      if (accordionComponentState.segment.get(this.message.id).get(segmentId).field.get(fieldId).component.has(componentId)) {
        state = accordionComponentState.segment.get(this.message.id).get(segmentId).field.get(fieldId).component.get(componentId);
      } else {
        state = false;
      }
    }).unsubscribe();
    return state;
  }

  extendComponentAccordion(segmentId: number, fieldId: number, componentId: number, componentAccordionState: boolean) {
    this.ngRedux.dispatch({
      type: TOGGLE_COMPONENT_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentId,
        fieldID: fieldId,
        componentID: componentId,
        componentToggleState: componentAccordionState,
        segmentToggleState: true,
        fieldToggleState: true
      }
    });
  }
}
