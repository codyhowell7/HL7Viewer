import { Map } from 'immutable';
import { IAppState, IMessage } from '../../app/states/states';
import { select, NgRedux } from 'ng2-redux';
import { HL7Segment } from '../../parser/HL7Segment';
import {
    IMessageDiscrepancies, ISegmentDiscrepancies,
    IFieldDiscrepancies, IComponentDiscepancies, ISubComponentDiscrepancies
} from './IMessageDiscrepancies';
import { SAVE_DISCREPANCY } from '../../app/constants/constants';
import { MessageCompareHelper } from './messageCompareHelper';
import { Observable } from 'rxjs/Observable';

export class MessageCompare extends MessageCompareHelper {

    @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;
    @select(['messages']) messages$: Observable<Map<number, IMessage>>;

    messages: Map<number, IMessage>;
    discrep: IMessageDiscrepancies = { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() };
    messagesSwitched: boolean;
    message1ID;
    message2ID;

    constructor(private ngRedux: NgRedux<IAppState>) {
        super(ngRedux);
        this.messagesToCompare$.subscribe(messagesToCompare => {
            this.message1ID = messagesToCompare.get(0);
            this.message2ID = messagesToCompare.get(1);
        });
        this.messages$.subscribe(messages => this.messages = messages);
    }

    public gatherMessages() {
        let message1Segs;
        let message2Segs;
        this.messages.forEach(message => {
            if (message.id + 1 === this.message1ID) {
                message1Segs = message.message.hl7Segments;
            }
            if (message.id + 1 === this.message2ID) {
                message2Segs = message.message.hl7Segments;
            }
        });
        if (message2Segs.length > message1Segs.length) {
            let temp = message1Segs;
            message1Segs = message2Segs;
            message2Segs = temp;
            this.messagesSwitched = true;
        }
        this.combSegments(message1Segs, message2Segs);
        this.ngRedux.dispatch({
            type: SAVE_DISCREPANCY,
            payload: {
                discrepancies: this.discrep
            }
        });
    }

    private combSegments(message1Segs: HL7Segment[], message2Segs: HL7Segment[]): IMessageDiscrepancies {
        if (this.areBothSegmentListsEmpty(message1Segs, message2Segs)) {
            if (this.messagesSwitched) {
                this.discrep = this.swap(this.discrep);
            }
            if (this.areSegmentsMissingAtEndOfMessage()) {
                this.discrep = this.addDiscrepanciesForSeveralMissingSegmentsAtEndOfMessage(this.discrep);
            }
            return this.discrep;
        } else if (this.isSegmentList2Empty(message2Segs)) {
            return this.addM1EndOfListDiscrepencies(message1Segs, this.discrep, this.messagesSwitched);
        } else if (this.isSegmentList1Empty(message1Segs)) {
            return this.addM2EndOfListDiscrepencies(message2Segs, this.discrep, this.messagesSwitched);
        } else if (this.segmentHeadersMatch(message1Segs[0].segmentName, message2Segs[0].segmentName)) {
            this.discrep = this.addDiscrepanciesForMatchingSegmentHeaders(this.discrep, message1Segs, message2Segs);
            return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
        } else if (this.segmentHeadersMisMatch(message1Segs[0].segmentName, message2Segs[0].segmentName)) {
            let match = this.nextMatch(message1Segs, 0, message2Segs, 0);
            if (match[0] === 0 && match[1] === 0) {
                this.discrep = this.addDiscrepanciesForMissingSegmentHeaders(message1Segs, message2Segs, this.discrep);
                return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
            }
            this.addOffsetDiscepencies(message1Segs[0], message2Segs[0], match, this.discrep);
            if (match[0] > 0 && match[1] > 0) {
                return this.combSegments(message1Segs.slice(match[0] + 1), message2Segs.slice(match[1] + 1));
            } else if (match[0] > 0) {
                return this.combSegments(message1Segs.slice(match[0] + 1), message2Segs.slice(1));
            } else {
                return this.combSegments(message1Segs.slice(match[1]), message2Segs.slice(match[1] + 1));
            }

        }

    }
}


