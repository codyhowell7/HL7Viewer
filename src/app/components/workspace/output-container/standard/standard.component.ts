import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { GetNextSegment } from '../../../../services/get-next-segment-service';
import { GetNextField } from '../../../../services/get-next-field-service';
import { GetNextComponent } from '../../../../services/get-next-component-service';
import { IMessage, IAppState } from '../../../../states/states';
import {
  TOGGLE_ACCORDION, DEFAULT_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
  DEFAULT_FIELD_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_COMPONENT_ACCORDIONS
} from '../../../../constants/constants';


@Component({
  selector: 'hls-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  providers: [GetNextSegment, GetNextField, GetNextComponent]
})
export class StandardComponent implements OnInit {

  message: IMessage;
  messages: Map<number, IMessage>;
  theState: boolean;

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['accordion']) accordion$: Observable<Map<number, Map<number, boolean>>>;
  @select(['fieldAccordion']) fieldAccordion$: Observable<Map<number, Map<number, boolean>>>;
  @select(['componentAccordion']) componentAccordion$: Observable<Map<number, Map<number, boolean>>>;

  constructor(private ngRedux: NgRedux<IAppState>, private getNextSegment: GetNextSegment,
    private getNextField: GetNextField, private getNextComponent: GetNextComponent) {  }


  ngOnInit() {
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        this.messages = messages;
        let segmentOffset = this.getNextSegment.findSegmentOffset(currentMessage);
        messages.get(currentMessage).message.hl7Segments.forEach((segment, segmentIndex) => {
          this.ngRedux.dispatch({
            type: DEFAULT_ACCORDIONS,
            payload: {
              messageID: currentMessage,
              segmentID: segmentIndex + segmentOffset
            }
          });
          let fieldOffset = this.getNextField.findFieldOffset(segmentIndex + segmentOffset);
          segment.hl7Fields.forEach((field, fieldIndex) => {
            this.ngRedux.dispatch({
              type: DEFAULT_FIELD_ACCORDIONS,
              payload: {
                segmentID: segmentIndex + segmentOffset,
                fieldID: fieldIndex + fieldOffset
              }
            });
            let componentOffset = this.getNextComponent.findComponentOffset(fieldOffset + fieldIndex);
            field.hl7Components.forEach((component, componentIndex) => {
              this.ngRedux.dispatch({
                type: DEFAULT_COMPONENT_ACCORDIONS,
                payload: {
                  fieldID: fieldIndex + 1 + fieldOffset,
                  componentID: componentIndex + componentOffset
                }
              });
            });
          });
        });
        return messages.get(currentMessage);
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
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hasHL7Components) {
      return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hl7Components;
    } else {
      return;
    }
  }

  getSubComponents(segmentIndex: number, fieldIndex: number, componentIndex: number) {
    if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hasHL7Components) {
      if (this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hl7Components[componentIndex -1].hasSubComponents) {
        return this.message.message.hl7Segments[segmentIndex].hl7Fields[fieldIndex - 1].hl7Components[componentIndex -1].hl7SubComponents;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  getSegmentState(segmentId: number) {
    let state;
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
    let state;
    let correctedSegmentId = this.getNextSegment.findSegmentOffset(this.message.id);
    let correctedFieldId = this.getNextField.findFieldOffset(segmentId + correctedSegmentId);
    this.fieldAccordion$.subscribe(accordionFieldState => {
      return state =
        accordionFieldState.get(segmentId + correctedSegmentId).get(fieldId + correctedFieldId);
    });
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

  getComponentState(segmentId: number, fieldId: number, componentId: number) {
    let state;
    let correctedSegmentId = this.getNextSegment.findSegmentOffset(this.message.id);
    let correctedFieldId = this.getNextField.findFieldOffset(segmentId + correctedSegmentId);
    let correctedComponentId = this.getNextComponent.findComponentOffset(fieldId + correctedFieldId);
    this.componentAccordion$.subscribe(accordionComponentState => {
      return state = accordionComponentState.get(fieldId + correctedFieldId).get(componentId + correctedComponentId);
    });
    return state;
  }

  extendComponentAccordion(segmentId: number, fieldId: number, componentId: number, componentAccordionState: boolean) {
    let correctedSegmentId = this.getNextSegment.findSegmentOffset(this.message.id);
    let correctedFieldId = this.getNextField.findFieldOffset(segmentId + correctedSegmentId);
    let correctedComponentId = this.getNextComponent.findComponentOffset(fieldId + correctedFieldId);
    this.ngRedux.dispatch({
      type: TOGGLE_COMPONENT_ACCORDION,
      payload: {
        fieldID: fieldId + correctedFieldId,
        componentID: componentId + correctedComponentId,
        toggleState: componentAccordionState
      }
    });
  }



}
