import { HL7Message } from '../../parser/hl7Message';
import { HL7Segment } from '../../parser/hl7Segment';
import { HL7Field } from '../../parser/hl7Field';
import { HL7Component } from '../../parser/hl7Component';
import { HL7SubComponent } from '../../parser/hl7SubComponent';
import { select, NgRedux } from 'ng2-redux';
import { IMessage, IAppState } from '../states/states';
import * as transitJS from 'transit-immutable-js';

export class SerializeHelper {

    extras;

    constructor(private ngRedux: NgRedux<IAppState>) {
        this.serializeState();
    }

    serializeState() {
       let extras =
            [
                {
                    tag: 'HL7Message',
                    class: HL7Message,
                    write: function (v, h) {
                        return [v.hl7Segments, v.hl7MessageType, v.hl7MessageControllerId,
                        v.hl7MessageDateTime, v.hl7Version, v.hl7MessageId, v.hl7CorrectedMessage, v.value];
                    },
                    read: function (rep) {
                        let message = new HL7Message(rep[7]);
                        message.hl7Segments = rep[0];
                        message.hl7MessageType = rep[1];
                        message.hl7MessageControllerId = rep[2];
                        message.hl7MessageDateTime = rep[3];
                        message.hl7Version = rep[4];
                        message.hl7MessageId = rep[5];
                        message.hl7CorrectedMessage = rep[6];
                        return message;
                    }
                },

                {
                    tag: 'HL7Segment',
                    class: HL7Segment,
                    write: function (v, h) {
                        return [v.hl7Fields, v.segmentName, v.segmentDesc,
                        v.isInQuickView, v.value, v.segmentIndex, v.segmentSetId];
                    },
                    read: function (rep) {
                        let segment = new HL7Segment(rep[4], rep[5]);
                        segment.hl7Fields = rep[0];
                        segment.segmentName = rep[1];
                        segment.segmentDesc = rep[2];
                        segment.isInQuickView = rep[3];
                        segment.segmentSetId = rep[6];
                        return segment;
                    }
                },

                {
                    tag: 'HL7Field',
                    class: HL7Field,
                    write: function (v, h) {
                        return [v.hl7Components, v.hl7RepeatedFields, v.fieldDesc,
                        v.hasRepetition, v.hasHL7Components, v.isInQuickView, v.value, v.index];
                    },
                    read: function (rep) {
                        let field = new HL7Field(rep[6], rep[7]);
                        field.hl7Components = rep[0];
                        field.hl7RepeatedFields = rep[1];
                        field.fieldDesc = rep[2];
                        field.hasRepetition = rep[3];
                        field.hasHL7Components = rep[4];
                        field.isInQuickView = rep[5];
                        return field;
                    },
                },

                {
                    tag: 'HL7Component',
                    class: HL7Component,
                    write: function (v, h) {
                        return [v.hl7SubComponents, v.hasSubComponents, v.isInQuickView,
                        v.value, v.index];
                    },
                    read: function (rep) {
                        let component = new HL7Component(rep[3], rep[4]);
                        component.hl7SubComponents = rep[0];
                        component.hasSubComponents = rep[1];
                        component.isInQuickView = rep[2];
                        return component;
                    }
                },

                {
                    tag: 'HL7SubComponent',
                    class: HL7SubComponent,
                    write: function (v, h) {
                        return [v.isInQuickView, v.value, v.index];
                    },
                    read: function (rep) {
                        let subComponent = new HL7SubComponent(rep[1], rep[2]);
                        subComponent.isInQuickView = rep[0];
                        return subComponent;
                    }

                }];
        this.extras = extras;

    }

    write() {
        try {
            let stateTree = transitJS.withExtraHandlers(this.extras).toJSON(this.ngRedux.getState());
            return localStorage.setItem('state', stateTree);
        } catch (err) {
            console.log(err);
        }
    }

    read() {
        try {
            const stateTree = localStorage.getItem('state');
            if (stateTree == null) {
                return undefined;
            }
            return transitJS.withExtraHandlers(this.extras).fromJSON(stateTree);
        } catch (err) {
            return undefined;
        }
    }
}
