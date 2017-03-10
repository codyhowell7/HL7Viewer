import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../app/states/states';
import { select, NgRedux } from 'ng2-redux';
import { HL7Message } from '../parser/HL7Message';
import { HL7Segment } from '../parser/HL7Segment';
import { HL7Field } from '../parser/HL7Field';
import { HL7Component } from '../parser/HL7Component';
import {
    IMessageDiscrepancies, ISegmentDiscrepancies,
    IFieldDiscrepancies, IComponentDiscepancies, ISubComponentDiscrepancies
} from './IMessageDiscrepancies';
import { SAVE_DISCREPANCY } from '../app/constants/constants';

export class MessageCompare {

    @select(['messages']) messages$: Observable<Map<number, IMessage>>;

    messages: Map<number, IMessage>;
    discrep: IMessageDiscrepancies = { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() };
    switched: boolean;
    m1ExtraLines = 0;
    m2ExtraLines = 0;
    prevNoMatch = 0;
    message1ID;
    message2ID;

    constructor(private ngRedux: NgRedux<IAppState>) {
        this.messages$.subscribe(messages => this.messages = messages);
    }

    public gatherMessages(messageId1: number, messageId2: number) {
        let message1Segs;
        let message2Segs;
        this.message1ID = messageId1;
        this.message2ID = messageId2;
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
        this.combSegments(message1Segs, message2Segs);
        this.ngRedux.dispatch({
            type: SAVE_DISCREPANCY,
            payload: {
                discrepancies: this.discrep
            }
        });
    }

    private addOffsetDiscepencies(message1: HL7Segment, message2: HL7Segment, offsets: [number, number]) {
        for (let i = 0; i < offsets[1]; i++) {
            this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + i + this.m1ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            if (this.discrep.message2.get(message2.segmentIndex + i + this.m2ExtraLines) == null) {
                this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + i + this.m2ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        if (offsets[1] > 0) {
            this.m1ExtraLines += offsets[1];
            this.m2ExtraLines += offsets[0];
        }
        for (let j = 0; j < offsets[0]; j++) {
            this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + j + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });

            if (this.discrep.message1.get(message1.segmentIndex + j + this.m1ExtraLines) == null) {
                this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + j + this.m1ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
            }
        }
        if (!(offsets[1] > 0 && offsets[0] > 0)) {
            this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + offsets[0] + this.m1ExtraLines, {
                fields: this.combFields(this.skipXSegments(message1, 0, offsets[0]), message2),
                missing: false
            });
            this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + offsets[0] + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            this.m1ExtraLines += offsets[1];
            this.m2ExtraLines += offsets[0];
        } else {
            this.discrep.message2 = this.discrep.message2.set(this.discrep.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + offsets[1] + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + offsets[1] + this.m1ExtraLines, {
                fields: this.combFields(this.skipXSegments(message1, 0, offsets[1]), this.skipXSegments(message2, 1, offsets[0])),
                missing: false
            });
            this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + offsets[0] + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        }
    }

    skipXSegments(segment: HL7Segment, messageSide: 0 | 1, numberToSkip: number) {
        switch (messageSide) {
            case 0:
                if (this.messages.get(this.message1ID).message.hl7Segments[segment.segmentIndex + numberToSkip] != null) {
                    return this.messages.get(this.message1ID).message.hl7Segments[segment.segmentIndex + numberToSkip];
                } else {
                    let max = this.messages.get(this.message1ID).message.hl7Segments.length;
                    return this.messages.get(this.message1ID).message.hl7Segments[max];
                }
            case 1:
                if (this.messages.get(this.message2ID).message.hl7Segments[segment.segmentIndex + numberToSkip] != null) {
                    return this.messages.get(this.message2ID).message.hl7Segments[segment.segmentIndex + numberToSkip];
                } else {
                    let max = this.messages.get(this.message2ID).message.hl7Segments.length;
                    return this.messages.get(this.message2ID).message.hl7Segments[max];
                }
        }
    }

    swap() {
        let temp = this.discrep.message1;
        this.discrep.message1 = this.discrep.message2;
        this.discrep.message2 = temp;
        this.discrep.message2.forEach((segment, segmentIndex) => {
            this.discrep.message1.get(segmentIndex).fields = segment.fields;
        });
    }

    private addM1EndOfListDiscepencies(message: HL7Segment[]) {
        message.forEach((segment, segIndex) => {
            this.discrep.message2 = this.discrep.message2.set(this.discrep.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            this.discrep.message1 = this.discrep.message1.set(this.discrep.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
        });
        if (this.switched) {
            this.swap();
        }
        return this.discrep;
    }

    private addM2EndOfListDiscepencies(message: HL7Segment[]) {
        message.forEach((segment, segIndex) => {
            this.discrep.message1 = this.discrep.message1.set(this.discrep.message1.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            this.discrep.message2 = this.discrep.message2.set(this.discrep.message2.size, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
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
            if (this.prevNoMatch > 0) {
                this.discrep.message1 = this.discrep.message1.set(this.discrep.message1.size - 1, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
                for (let i = 1; i < this.prevNoMatch; i++) {
                    this.discrep.message1 = this.discrep.message1.set(this.discrep.message1.size, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: false
                    });
                    this.discrep.message2 = this.discrep.message2.set(this.discrep.message2.size, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: true
                    });
                }
                this.discrep.message2 = this.discrep.message2.set(this.discrep.message2.size, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: true
                });
            }
            return this.discrep;
        } else if (message2Segs.length === 0) {
            return this.addM1EndOfListDiscepencies(message1Segs);
        } else if (message1Segs.length === 0) {
            return this.addM2EndOfListDiscepencies(message2Segs);
        } else if (message1Segs[0].segmentName === message2Segs[0].segmentName) {
            this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex, {
                fields: this.combFields(message1Segs[0], message2Segs[0]),
                missing: false
            });
            this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: false
            });
            return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
        } else {
            let match = this.nextMatch(message1Segs, 0, message2Segs, 0);
            if (match[0] === 0 && match[1] === 0) {
                if (this.prevNoMatch === 0) {
                    this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex + this.m1ExtraLines, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: true
                    });
                    this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex + this.m1ExtraLines + 1, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: false
                    });
                    this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex + this.m2ExtraLines, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: false
                    });
                    this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex + this.m2ExtraLines + 1, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: true
                    });
                } else {
                    this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex + this.m1ExtraLines, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: true
                    });
                    this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex + this.m1ExtraLines + 1, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: false
                    });
                    this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex + this.m2ExtraLines, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: false
                    });
                    this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex + this.m2ExtraLines + 1, {
                        fields: Map<number, IFieldDiscrepancies>(),
                        missing: true
                    });
                }
                this.prevNoMatch++;
                return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
            }
            this.addOffsetDiscepencies(message1Segs[0], message2Segs[0], match);
            if (match[0] > 0 && match[1] > 0) {
                return this.combSegments(message1Segs.slice(match[0] + 1), message2Segs.slice(match[1] + 1));
            } else if (match[0] > 0) {
                return this.combSegments(message1Segs.slice(match[0] + 1), message2Segs.slice(1));
            } else {
                return this.combSegments(message1Segs.slice(match[1]), message2Segs.slice(match[1] + 1));
            }
        }
    }
    private combFields(segment1: HL7Segment, segment2: HL7Segment): Map<number, IFieldDiscrepancies> {
        let fieldsSwapped: boolean;
        let fieldDiscrepancies = Map<number, IFieldDiscrepancies>();
        if (segment2.hl7Fields.length > segment1.hl7Fields.length) {
            let temp = segment1.hl7Fields;
            segment1.hl7Fields = segment2.hl7Fields;
            segment2.hl7Fields = temp;
            fieldsSwapped = true;
        }

        segment1.hl7Fields.filter(field => field.value !== '').forEach(field => {
            if (segment2.hl7Fields[field.index] == null) {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: true,
                    match: false
                });

            } else if (segment2.hl7Fields[field.index].value === segment1.hl7Fields[field.index].value) {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: false,
                    match: true
                });

            } else {
                if (!segment1.hl7Fields[field.index].hasHL7Components || !segment2.hl7Fields[field.index].hasHL7Components) {
                    fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                        components: Map<number, IComponentDiscepancies>(),
                        missing: false,
                        match: false
                    });

                } else {
                    fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                        components:  Map<number, IComponentDiscepancies>(),
                        missing: false,
                        match: false
                    });
                }
            }
        });

        segment2.hl7Fields.filter(field => field.value !== '').forEach(field => {
            if (segment1.hl7Fields[field.index] == null || segment1.hl7Fields[field.index].value === '') {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: true,
                    match: false
                });
            }
        });
        return fieldDiscrepancies;
    }
}

