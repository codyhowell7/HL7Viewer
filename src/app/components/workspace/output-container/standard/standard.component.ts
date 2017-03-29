import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { merge } from 'rxjs/observable/merge';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IMessage, IAppState, IAccordion } from '../../../../states/states';
import {
  TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
  DEFAULT_FIELD_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_COMPONENT_ACCORDIONS,
  TOGGLE_REPEAT_FIELD_ACCORDION, DEFAULT_REPEAT_FIELD_ACCORDIONS, DEFAULT_REPEAT_COMPONENT_ACCORDIONS,
  TOGGLE_REPEAT_COMPONENT_ACCORDION
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

  constructor(private ngRedux: NgRedux<IAppState>, private router: Router) { }


  ngOnInit() {
    this.router.navigate(['/workspace/0/standard']);
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        let message = messages.get(currentMessage);
        this.messageId = currentMessage;
        return message;
      })
      .subscribe(message => { this.message = message; });
  }

  getSegments() {
    let segments = this.message.message.hl7Segments;
    return segments;
  }

  getFields(segmentIndex: number) {
    let fields = this.message.message.hl7Segments[segmentIndex].hl7Fields;
    return fields;
  }

  getRepeat(segmentIndex: number, fieldIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasRepetition) {
      let repeatFields = this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7RepeatedFields;
      return repeatFields;
    }
  }

  getComponents(segmentIndex: number, fieldIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components) {
      let components = this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components;
      return components;
    } else {
      return;
    }
  }

  getRepeatComponents(segmentIndex: number, fieldIndex: number, repeatIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasRepetition) {
      let repeatComponents = this.message.message.hl7Segments[segmentIndex].
        hl7Fields[fieldIndex].hl7RepeatedFields[repeatIndex].hl7Components;
      return repeatComponents;
    } else {
      return;
    }
  }

  getRepeatSubComponents(segmentIndex: number, fieldIndex: number, repeatIndex: number, componentIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex]
      .hl7RepeatedFields[repeatIndex].hl7Components[componentIndex].hasSubComponents) {
        let repeatSubComponents = this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex]
        .hl7RepeatedFields[repeatIndex].hl7Components[componentIndex].hl7SubComponents;
      return repeatSubComponents;
    } else {
      return;
    }
  }

  getSubComponents(segmentIndex: number, fieldIndex: number, componentIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components) {
      if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components[componentIndex].hasSubComponents) {
        let subComponents = this.message.message.hl7Segments[segmentIndex].
          hl7Fields[fieldIndex].hl7Components[componentIndex].hl7SubComponents;
        return subComponents;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  hasComponents(segmentIndex: number, fieldIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasHL7Components;
  }
  hasRepeatComponents(segmentIndex: number, fieldIndex: number, repeatIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7RepeatedFields[repeatIndex].hasHL7Components;
  }

  hasSubComponents(segmentIndex: number, fieldIndex: number, componentIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hl7Components[componentIndex].hasSubComponents;
  }
  hasRepeatSubComponents(segmentIndex: number, fieldIndex: number, componentIndex: number, repeatIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex]
      .hl7RepeatedFields[repeatIndex].hl7Components[componentIndex].hasSubComponents;
  }

  hasRepeat(segmentIndex: number, fieldIndex: number) {
    return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex].hasRepetition;
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
      let fields = this.message.message.hl7Segments[segmentIndex].hl7Fields;
      fields.forEach((field, fieldIndex) => {
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
    this.accordion$.subscribe(accordionFieldState => {
      if (this.message.message.hl7Segments[segmentId].hl7Fields[fieldId].hasRepetition) {
        let repeatFields = this.message.message.hl7Segments[segmentId].hl7Fields[fieldId].hl7RepeatedFields;
        repeatFields.forEach((repeatField, repeatFieldIndex) => {
          this.ngRedux.dispatch({
            type: DEFAULT_REPEAT_FIELD_ACCORDIONS,
            payload: {
              messageID: this.messageId,
              segmentID: segmentId,
              fieldID: fieldId,
              repeatID: repeatFieldIndex,
              segmentToggleState: accordionFieldState.segment.get(this.message.id).get(segmentId).segmentAccordionState,
              fieldToggleState: accordionFieldState.segment.get(this.messageId).get(segmentId).field.get(fieldId).fieldAccordionState
            }
          });
        });
      } else {
        let components = this.message.message.hl7Segments[segmentId].hl7Fields[fieldId].hl7Components;
          components.forEach((component, componentIndex) => {
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
      }
    }).unsubscribe();
    this.ngRedux.dispatch({
      type: TOGGLE_FIELD_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentId,
        fieldID: fieldId,
        fieldToggleState: fieldAccordionState,
        segmentToggleState: true,
        fieldHasRepeat: this.message.message.hl7Segments[segmentId].hl7Fields[fieldId].hasRepetition
      }
    });
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

  getRepeatFieldState(segmentId: number, fieldId: number, repeatId: number) {
    let state;
    this.accordion$.subscribe(accordionRepeatState => {
      if (accordionRepeatState.segment.get(this.message.id).get(segmentId).field.get(fieldId).repeatField.get(repeatId) != null) {
        state = accordionRepeatState.segment.get(this.message.id).get(segmentId).field
          .get(fieldId).repeatField.get(repeatId).repeatFieldAccordionState;
      } else {
        state = false;
      }
    }).unsubscribe();
    return state;
  }

  extendRepeatFieldAccordion(segmentId: number, fieldId: number, repeatId: number, fieldAccordionState: boolean) {
    this.accordion$.subscribe(accordionRepeatState => {
      this.ngRedux.dispatch({
        type: DEFAULT_REPEAT_COMPONENT_ACCORDIONS,
        payload: {
          messageID: this.messageId,
          segmentID: segmentId,
          fieldID: fieldId,
          repeatID: repeatId,
          segmentToggleState: accordionRepeatState.segment.get(this.message.id).get(segmentId).segmentAccordionState,
          fieldToggleState: accordionRepeatState.segment.get(this.message.id).get(segmentId).field.get(fieldId).fieldAccordionState,
          repeatToggleState: accordionRepeatState.segment.get(this.message.id).get(segmentId)
            .field.get(fieldId).repeatField.get(repeatId).repeatFieldAccordionState
        }
      });
    }).unsubscribe();
    this.ngRedux.dispatch({
      type: TOGGLE_REPEAT_FIELD_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentId,
        fieldID: fieldId,
        repeatID: repeatId,
        repeatToggleState: fieldAccordionState,
        segmentToggleState: true,
        fieldToggleState: true
      }
    });

  }

  getRepeatComponentState(segmentId: number, fieldId: number, repeatId: number, componentId: number) {
    let state;
    this.accordion$.subscribe(accordionRepeatComponentState => {
      if (accordionRepeatComponentState.segment.get(this.message.id).get(segmentId).field.get(fieldId)
        .repeatField.get(repeatId).repeatComponent.get(componentId) != null) {
        state = accordionRepeatComponentState.segment.get(this.message.id).get(segmentId).field.get(fieldId)
          .repeatField.get(repeatId).repeatComponent.get(componentId);
      } else {
        state = false;
      }
    }).unsubscribe();
    return state;
  }

  extendRepeatComponentAccordion(segmentId: number, fieldId: number, repeatId: number,
    componentId: number, componentAccordionState: boolean) {
    this.ngRedux.dispatch({
      type: TOGGLE_REPEAT_COMPONENT_ACCORDION,
      payload: {
        messageID: this.messageId,
        segmentID: segmentId,
        fieldID: fieldId,
        repeatID: repeatId,
        componentID: componentId,
        componentToggleState: componentAccordionState,
        repeatToggleState: true,
        segmentToggleState: true,
        fieldToggleState: true
      }
    });
  }

}
