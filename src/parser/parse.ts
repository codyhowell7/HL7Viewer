import { HL7Message } from './message';
import { HL7Segment } from './segment';
import { HL7Field } from './field';
import { HL7Component } from './hl7Component';
import { HL7SubComponent } from './hl7SubComponent';

export class Parser {
    messageEncodingChars: string;

    constructor(messageEncodingChars: string) {
        this.messageEncodingChars = messageEncodingChars;
    }

    public hl7MessageParse(messageValue: string) {
        return new HL7Message(messageValue, this.hl7SegmentParse(messageValue));
    }

    public hl7SegmentParse(segmentValue: string) {
        let fieldSeperator = this.messageEncodingChars.substr(0, 1); // Typically |
        let Segments = [];
        let segmentSplit = new RegExp('[\\s](?=[A-Z][A-Z][A-Z,0-9][\\' + fieldSeperator + '])');
        let segmentArray = segmentValue.split(segmentSplit);
        segmentArray.forEach(segmentElement => {
            segmentElement = segmentElement.trim();
            Segments.push(new HL7Segment(segmentElement, this.hl7FieldParse(segmentElement)));
        });
        return Segments;
    }

    public hl7FieldParse(segmentValue: string) {
        let Fields = [];
        let fieldSeperator = this.messageEncodingChars.substr(0, 1);
        let fieldSplit = new RegExp('[\\' + fieldSeperator + ']');
        let fieldArray = segmentValue.split(fieldSplit).slice(1);
        if (segmentValue.substring(0, 3) === 'MSH') {
            fieldArray.unshift(fieldSeperator);
        }
        fieldArray.forEach((fieldElement, fieldIndex) => {
            Fields.push(new HL7Field(fieldElement, fieldIndex + 1, this.hl7ComponentParse(fieldElement, fieldIndex)));
        });
        return Fields;
    }

    public hl7ComponentParse(fieldValue: string, fieldIndex: number) {
        let RepeatedFields = [];
        let RepeatStaging = [];
        let HL7Components = [];
        let repeatSeperator = this.messageEncodingChars.substr(2, 1);
        let repeatSplit = new RegExp('[\\' + repeatSeperator + ']'); // Typically ~
        let repeatArray = fieldValue.split(repeatSplit);
        if (repeatArray.length > 1) { // Only pushes to repeatArray when a ~ is found.
            if (fieldValue !== this.messageEncodingChars.substr(1)) {
                repeatArray.forEach((repeatElement, repeatIndex) => {
                    RepeatStaging.push(new HL7Field(repeatElement, repeatIndex + 1,
                    this.hl7ComponentParse(repeatElement, repeatIndex), true));
                });
                return RepeatStaging;
            }
            return [];
        } else {
            let hl7ComponentSeperator = this.messageEncodingChars.substr(1, 1); // Typically ^
            let hl7ComponentSplit = new RegExp('[\\' + hl7ComponentSeperator + ']');
            let hl7ComponentArray = fieldValue.split(hl7ComponentSplit);
            if (hl7ComponentArray.length > 1) {
                hl7ComponentArray.forEach((hl7ComponentElement, hl7ComponentIndex) => {
                    HL7Components.push(new HL7Component(hl7ComponentElement, hl7ComponentIndex + 1,
                        this.hl7SubComponentParse(hl7ComponentElement, hl7ComponentIndex)));
                });
                return HL7Components;
            }
            return [];
        }
    }

    public hl7SubComponentParse(subComponentValue: string, subComponentIndex: number) {
        let HL7SubComponents = [];
        let hl7SubComponentSeperator = this.messageEncodingChars.substr(4, 1);
        let hl7SubCompnentSplit = new RegExp('[\\' + hl7SubComponentSeperator + ']');
        let hl7SubComponentArray = subComponentValue.split(hl7SubCompnentSplit);
        if (hl7SubComponentArray.length > 1) {
            hl7SubComponentArray.forEach((hl7SubComponentElement, hl7SubComponentIndex) => {
                HL7SubComponents.push(new HL7SubComponent(hl7SubComponentElement, hl7SubComponentIndex + 1));
            });
        }
        return HL7SubComponents;
    }
}
