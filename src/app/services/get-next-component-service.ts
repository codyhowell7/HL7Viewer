import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../states/states';
import { select, NgRedux } from 'ng2-redux';
import { COMPONENT_OFFSET, FIELD_OFFSET, SEGMENT_OFFSET } from '../constants/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetNextComponent {

    @select(['componentOffset']) componentOffset$: Observable<Map<number, number>>;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    public nextComponentOffset(messages: Map<number, IMessage>) {
        let segmentOffset = 0;
        let persistField = 0;
        let persistSeg = 0;
        let fieldOffset = 0;
        let componentOffset = 0;
        console.log(`Running...`);
        messages.forEach((message, messageIndex) => {
            segmentOffset += message.message.hl7Segments.length;
            this.ngRedux.dispatch({
                type: SEGMENT_OFFSET,
                payload: {
                    messageID: messageIndex,
                    segmentIdOffset: segmentOffset
                }
            });
            message.message.hl7Segments.forEach((segment, segmentIndex) => {
                persistSeg++;
                fieldOffset += segment.hl7Fields.length;
                this.ngRedux.dispatch({
                    type: FIELD_OFFSET,
                    payload: {
                        segmentID: persistSeg,
                        fieldIdOffset: fieldOffset
                    }
                });
                segment.hl7Fields.forEach((field, fieldIndex) => {
                    persistField++;
                    componentOffset += field.hl7Components.length;
                    this.ngRedux.dispatch({
                        type: COMPONENT_OFFSET,
                        payload: {
                            fieldID: persistField,
                            componentIdOffset: componentOffset
                        }
                    });
                });
            });
        });
    }
    public findComponentOffset(fieldID: number) {
        let componentOffset: Map<number, number>;
        this.componentOffset$.subscribe(fieldId => componentOffset = fieldId);
        return componentOffset.get(fieldID);
    }
}
