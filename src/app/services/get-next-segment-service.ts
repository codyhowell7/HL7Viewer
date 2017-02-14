import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../states/states';
import { select, NgRedux } from 'ng2-redux';
import { SEGMENT_OFFSET } from '../constants/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetNextSegment {

@select(['segmentOffset']) segmentOffset$: Observable<Map<number, number>>;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    public nextSegmentOffset(messages: Map<number, IMessage>): number {
        let segmentOffset = 0;
        for (let i = 0; i < messages.size; i++) {
            segmentOffset += messages.get(i).message.hl7Segments.length;
        }
        this.ngRedux.dispatch({
            type: SEGMENT_OFFSET,
            payload: {
                messageID: messages.size,
                segmentIdOffset: segmentOffset
            }
        });
        return segmentOffset;
    }
    public findSegmentOffset(messageID: number) {
        let segmentOffset: Map<number, number>;
        this.segmentOffset$.subscribe(messageId => segmentOffset = messageId);
        return segmentOffset.get(messageID);
    }

}
