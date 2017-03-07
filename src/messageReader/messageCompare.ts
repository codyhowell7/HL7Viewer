import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../app/states/states';
import { select, NgRedux } from 'ng2-redux';
import { HL7Message } from '../parser/HL7Message';
import { HL7Segment } from '../parser/HL7Segment';
import { IMessageDiscrepancies, ISegmentDiscrepancies, IFieldDiscrepancies } from './IMessageDiscrepancies';

export class MessageCompare {

    @select(['messages']) messages$: Observable<Map<number, IMessage>>;

    messages: Map<number, IMessage>;
    discrep: IMessageDiscrepancies = { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() };
    switched: boolean;
    m1ExtraLines = 0;
    m2ExtraLines = 0;

    constructor() {
        this.messages$.subscribe(messages => this.messages = messages);
    }

    public gatherMessages(messageId1: number, messageId2: number): IMessageDiscrepancies {
        let message1Segs;
        let message2Segs;
        this.messages.forEach(message => {
            if (message.id === messageId1) {
                message1Segs = message.message.hl7Segments;
            }
            if (message.id === messageId2) {
                message2Segs = message.message.hl7Segments;
            }
        });
        if (message2Segs.length > message1Segs.length) {
            let temp = message1Segs;
            message1Segs = message2Segs;
            message2Segs = temp;
            this.switched = true;
        }
        return this.combSegments(message1Segs, message2Segs);
    }

    private addOffsetDiscepencies(m1Index: number, m2Index: number, offsets: [number, number]) {
        console.log(`M1Index: ${m1Index}, m2Index: ${m2Index}`)
        console.log(offsets);
        for (let i = 0; i < offsets[1]; i++) {
            this.discrep.message1 = this.discrep.message1.set(m1Index + i, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            if (this.discrep.message1.get(m2Index + i) == null) {
                this.discrep.message2 = this.discrep.message2.set(m2Index + i + this.m2ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        for (let j = 0; j < offsets[0]; j++) {
            this.discrep.message2 = this.discrep.message2.set(m2Index + j + this.m2ExtraLines + offsets[1], {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            if (this.discrep.message1.get(m1Index + j) == null) {
                this.discrep.message1 = this.discrep.message1.set(m1Index + j, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        this.m1ExtraLines += offsets[1];
        this.m2ExtraLines += offsets[0];
    }

    swap() {
        let temp = this.discrep.message1;
        this.discrep.message1 = this.discrep.message2;
        this.discrep.message2 = temp;
    }

    private addEndOfListDiscepencies(message: HL7Segment[]) {
        message.forEach((segment, segIndex) => {
            this.discrep.message2 = this.discrep.message2.set(segment.segmentIndex, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
        });
        if (this.switched) {
            this.swap();
        }
        return this.discrep;
    }

    private nextMatch(message1: HL7Segment[], m1Counter: number, message2: HL7Segment[], m2Counter: number): [number, number] {
        if (message1[m1Counter] == null) {
            return [0, 0];
        } else if (message2[m2Counter] == null) {
            return this.nextMatch(message1, ++m1Counter, message2, 0);
        } else if (message1[m1Counter].segmentName === message2[m2Counter].segmentName) {
            return [m1Counter, m2Counter];
        } else {
            return this.nextMatch(message1, m1Counter, message2, ++m2Counter);
        }
    }

    private combSegments(message1Segs: HL7Segment[], message2Segs: HL7Segment[]): IMessageDiscrepancies {
        if (message1Segs.length === 0 && message2Segs.length === 0) {
            if (this.switched) {
                this.swap();
            }
            return this.discrep;
        } else if (message2Segs.length === 0) {
            return this.addEndOfListDiscepencies(message1Segs);
        } else if (message1Segs[0].segmentName === message2Segs[0].segmentName) {
            this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex, {
                fields: this.combFields(message1Segs[0], message2Segs[0]),
                missing: false
            });
            this.discrep.message2 = this.discrep.message2.set(message1Segs[0].segmentIndex, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
        } else {
            let match = this.nextMatch(message1Segs, 0, message2Segs, 0);
            if (match[0] === 0 && match[1] === 0) {
                this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: true
                });
                this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
                return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
            }
            this.addOffsetDiscepencies(message1Segs[0].segmentIndex, message2Segs[0].segmentIndex, match);
            if (match[0] > 0) {
                return this.combSegments(message1Segs.slice(match[0] + 1), message2Segs.slice(1));
            } else {
                return this.combSegments(message1Segs.slice(match[1]), message2Segs.slice(match[1] + 1));
            }
        }
    }
    private combFields(segment1, segment2): Map<number, IFieldDiscrepancies> {
        return Map<number, IFieldDiscrepancies>();
    }
}
