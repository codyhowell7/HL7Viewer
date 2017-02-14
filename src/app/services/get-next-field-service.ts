import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../states/states';
import { select, NgRedux } from 'ng2-redux';
import { FIELD_OFFSET } from '../constants/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetNextField {

    @select(['fieldOffset']) fieldOffset$: Observable<Map<number, number>>;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    public nextFieldOffset(messages: Map<number, IMessage>): number {
        let fieldOffset = 0;
        let persistSegID = 0;
        for (let i = 0; i < messages.size; i++) {
            for (let j = 0; j < messages.get(i).message.hl7Segments.length; j++) {
                persistSegID++;
                fieldOffset += messages.get(i).message.hl7Segments[j].hl7Fields.length;
                this.ngRedux.dispatch({
                    type: FIELD_OFFSET,
                    payload: {
                        segmentID: persistSegID,
                        fieldIdOffset: fieldOffset
                    }
                });
            }
        }
        return fieldOffset;
    }
    public findFieldOffset(segmentID: number) {
        let fieldOffset: Map<number, number>;
        this.fieldOffset$.subscribe(segmentId => fieldOffset = segmentId);
        return fieldOffset.get(segmentID);
    }

}
