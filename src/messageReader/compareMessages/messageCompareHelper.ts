import { HL7Segment } from '../../parser/HL7Segment';
import { Map } from 'immutable';
import {
    IMessageDiscrepancies, ISegmentDiscrepancies,
    IFieldDiscrepancies, IComponentDiscepancies, ISubComponentDiscrepancies
} from './IMessageDiscrepancies';
import { FieldCompare } from './fieldCompare';
import { IMessage, IAppState } from '../../app/states/states';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

export class MessageCompareHelper {

    @select(['messages']) messages$: Observable<Map<number, IMessage>>;
    @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;

    numMissingAtEnd = 0;
    compareFields = new FieldCompare();
    messages: Map<number, IMessage>;
    message1ID: number;
    message2ID: number;

    constructor(ngRedux: NgRedux<IAppState>) {
        this.messages$.subscribe(messages => this.messages = messages);
        this.messagesToCompare$.subscribe(messagesToCompare => {
            this.message1ID = messagesToCompare.get(0);
            this.message2ID = messagesToCompare.get(1);
        })
    }

    protected isSegmentList1Empty(segList1: HL7Segment[]) {
        return segList1.length === 0;
    }

    protected isSegmentList2Empty(segList2: HL7Segment[]) {
        return segList2.length === 0;
    }

    protected areBothSegmentListsEmpty(segList1: HL7Segment[], segList2: HL7Segment[]) {
        if (segList1.length === 0 && segList2.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    protected areSegmentsMissingAtEndOfMessage() {
        return this.numMissingAtEnd > 0;
    }

    protected addDiscrepanciesForSeveralMissingSegmentsAtEndOfMessage(currentDiscrepancies: IMessageDiscrepancies) {

        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size - 1, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: false
        });
        newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size - 1, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: true
        });
        for (let i = 1; i < this.numMissingAtEnd; i++) {
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
        }
        return newDiscrepancies;
    }

    protected addDiscrepanciesForMatchingSegmentHeaders(currentDiscrepancies: IMessageDiscrepancies,
        message1SegList: HL7Segment[], message2SegList: HL7Segment[]) {

        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
            fields: this.compareFields.combFields(message1SegList[0], message2SegList[0]),
            missing: false
        });
        newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: false
        });
        return newDiscrepancies;
    }

    protected nextMatch(message1: HL7Segment[], m1Counter: number, message2: HL7Segment[], m2Counter: number): [number, number] {
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


    protected addDiscrepanciesForMissingSegmentHeaders(message1Segs: HL7Segment[],
        message2Segs: HL7Segment[], currentDiscrepancies: IMessageDiscrepancies) {

        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        if (this.numMissingAtEnd === 0) {
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        }
        newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size - 1, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: true
        });
        newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: false
        });
        newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size - 1, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: false
        });
        newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: true
        });

        this.numMissingAtEnd++;
        return newDiscrepancies;
    }

    protected addOffsetDiscepencies(message1: HL7Segment, message2: HL7Segment, offsets: [number, number],
        currentDiscrepancies: IMessageDiscrepancies) {

        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        for (let i = 0; i < offsets[1]; i++) {
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            if (newDiscrepancies.message2.get(newDiscrepancies.message2.size) == null) {
                newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        for (let j = 0; j < offsets[0]; j++) {
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });

            if (newDiscrepancies.message1.get(newDiscrepancies.message1.size) == null) {
                newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        if (!(offsets[1] > 0 && offsets[0] > 0)) {
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: this.compareFields.combFields(this.skipXSegments(message1, 0, offsets[1]), message2),
                missing: false
            });
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        } else {
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: this.compareFields.combFields(
                    this.skipXSegments(message1, 0, offsets[1]), this.skipXSegments(message2, 1, offsets[0])),
                missing: false
            });
        }
        return newDiscrepancies;
    }

    protected addM1EndOfListDiscrepencies(message: HL7Segment[], currentDiscrepancies: IMessageDiscrepancies, messagesSwitched: boolean) {
        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        for (let i = 0; i < this.numMissingAtEnd; i++) {
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        }
        if ( this.numMissingAtEnd === 0 ) {
            message.forEach(seg  => {
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            });
        }

        if (messagesSwitched) {
            newDiscrepancies = this.swap(newDiscrepancies);
        }
        return newDiscrepancies;
    }

    protected addM2EndOfListDiscrepencies(message: HL7Segment[], currentDiscrepancies: IMessageDiscrepancies, messagesSwitched: boolean) {
        let newDiscrepancies: IMessageDiscrepancies = currentDiscrepancies;
        message.forEach((segment, segIndex) => {
            newDiscrepancies.message1 = newDiscrepancies.message1.set(newDiscrepancies.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            newDiscrepancies.message2 = newDiscrepancies.message2.set(newDiscrepancies.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        });
        if (messagesSwitched) {
            this.swap(newDiscrepancies);
        }
        return newDiscrepancies;
    }


    private skipXSegments(segment: HL7Segment, messageSide: 0 | 1, numberToSkip: number) {
        switch (messageSide) {
            case 0:
                if (this.messages.get(this.message1ID - 1).message.hl7Segments[segment.segmentIndex + numberToSkip] != null) {
                    return this.messages.get(this.message1ID - 1).message.hl7Segments[segment.segmentIndex + numberToSkip];
                } else {
                    let max = this.messages.get(this.message1ID - 1).message.hl7Segments.length - 1;
                    return this.messages.get(this.message1ID - 1).message.hl7Segments[max];
                }
            case 1:
                if (this.messages.get(this.message2ID - 1).message.hl7Segments[segment.segmentIndex + numberToSkip] != null) {
                    return this.messages.get(this.message2ID - 1).message.hl7Segments[segment.segmentIndex + numberToSkip];
                } else {
                    let max = this.messages.get(this.message2ID - 1).message.hl7Segments.length - 1;
                    return this.messages.get(this.message2ID - 1).message.hl7Segments[max];
                }
        }
        return segment;
    }

    protected swap(currentDiscrepancies: IMessageDiscrepancies) {
        let temp = currentDiscrepancies.message1;
        currentDiscrepancies.message1 = currentDiscrepancies.message2;
        currentDiscrepancies.message2 = temp;
        currentDiscrepancies.message2.forEach((segment, segmentIndex) => {
            currentDiscrepancies.message1.get(segmentIndex).fields = segment.fields;
        });
        return currentDiscrepancies;
    }

    protected segmentHeadersMatch(segment1Header: string, segment2Header: string) {
        return segment1Header === segment2Header;
    }

    protected segmentHeadersMisMatch(segment1Header: string, segment2Header: string) {
        return segment1Header !== segment2Header;
    }
}