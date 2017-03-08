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
        for (let j = 0; j < offsets[0]; j++) {
            this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + j + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });

            if (this.discrep.message1.get(message1.segmentIndex + j + this.m1ExtraLines) == null) {
                this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + j + this.m1ExtraLines, {
                    fields: this.combFields(message1, message2),
                    missing: false
                });
            }
        }
        this.discrep.message2 = this.discrep.message2.set(message2.segmentIndex + offsets[0] + 1, {
            fields: Map<number, IFieldDiscrepancies>(),
            missing: false
        });
        this.discrep.message1 = this.discrep.message1.set(message1.segmentIndex + offsets[0], {
            fields: this.combFields(message1, message2),
            missing: false
        });
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
            this.discrep.message2 = this.discrep.message2.set(segment.segmentIndex + this.m2ExtraLines, {
                fields: Map<number, IFieldDiscrepancies>(),
                missing: true
            });
            this.discrep.message1 = this.discrep.message1.set(segment.segmentIndex + this.m1ExtraLines, {
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
            return this.discrep;
        } else if (message2Segs.length === 0) {
            return this.addEndOfListDiscepencies(message1Segs);
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
                this.discrep.message1 = this.discrep.message1.set(message1Segs[0].segmentIndex + this.m1ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: true
                });
                this.discrep.message1 = this.discrep.message1.set(message1Segs[1].segmentIndex + this.m1ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
                this.discrep.message2 = this.discrep.message2.set(message2Segs[0].segmentIndex + this.m2ExtraLines, {
                    fields: Map<number, IFieldDiscrepancies>(),
                    missing: false
                });
                this.m1ExtraLines++;
                return this.combSegments(message1Segs.slice(1), message2Segs.slice(1));
            }
            this.addOffsetDiscepencies(message1Segs[0], message2Segs[0], match);
            if (match[0] > 0) {
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
                        components: this.combComponents(segment1.hl7Fields[field.index], segment2.hl7Fields[field.index]),
                        missing: false,
                        match: false
                    });
                }
            }
        });

        segment2.hl7Fields.filter(field => field.value !== '').forEach(field => {
            if (segment1.hl7Fields[field.index] == null) {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: true,
                    match: false
                });
            }
        });
        return fieldDiscrepancies;
    }

    private combComponents(field1: HL7Field, field2: HL7Field) {
        let componentDiscrepancies = Map<number, IComponentDiscepancies>();
        field1.hl7Components.filter(component => component.value !== '').forEach(component => {
            if (field2.hl7Components[component.index] == null) {
                componentDiscrepancies = componentDiscrepancies.set(component.index, {
                    subComponents: Map<number, ISubComponentDiscrepancies>(),
                    missing: true,
                    match: false
                });

            } else if (field2.hl7Components[component.index].value === field1.hl7Components[component.index].value) {
                componentDiscrepancies = componentDiscrepancies.set(component.index, {
                    subComponents: Map<number, ISubComponentDiscrepancies>(),
                    missing: false,
                    match: true
                });

            } else {
                if (!field1.hl7Components[component.index].hasSubComponents || !field2.hl7Components[component.index].hasSubComponents) {
                    componentDiscrepancies = componentDiscrepancies.set(component.index, {
                        subComponents: Map<number, ISubComponentDiscrepancies>(),
                        missing: false,
                        match: false
                    });
                } else {
                    componentDiscrepancies = componentDiscrepancies.set(component.index, {
                        subComponents: this.combSubComponents(field1.hl7Components[component.index], field2.hl7Components[component.index]),
                        missing: false,
                        match: false
                    });
                }
            }
        });
        field2.hl7Components.filter(component => component.value !== '').forEach(component => {
            if (field1.hl7Components[component.index] == null) {
                componentDiscrepancies = componentDiscrepancies.set(component.index, {
                    subComponents: Map<number, ISubComponentDiscrepancies>(),
                    missing: true,
                    match: false
                });
            }
        });
        return componentDiscrepancies;
    }

    private combSubComponents(component1: HL7Component, component2: HL7Component) {
        let subComponentDiscrepancies = Map<number, ISubComponentDiscrepancies>();
        component1.hl7SubComponents.filter(subComponent => subComponent.value !== '').forEach(subComponent => {
            if (component2.hl7SubComponents[subComponent.index] == null) {
                subComponentDiscrepancies = subComponentDiscrepancies.set(subComponent.index, {
                    missing: true,
                    match: false
                });

            } else if (component2.hl7SubComponents[subComponent.index].value === component1.hl7SubComponents[subComponent.index].value) {
                subComponentDiscrepancies = subComponentDiscrepancies.set(subComponent.index, {
                    missing: false,
                    match: true
                });

            } else {
                subComponentDiscrepancies = subComponentDiscrepancies.set(subComponent.index, {
                    missing: false,
                    match: false
                });
            }
        });

        component2.hl7SubComponents.filter(subComponent => subComponent.value !== '').forEach(subComponent => {
            if (component1.hl7SubComponents[subComponent.index] == null) {
                subComponentDiscrepancies = subComponentDiscrepancies.set(subComponent.index, {
                    missing: true,
                    match: false
                });
            }
        });
        return subComponentDiscrepancies;
    }
}

