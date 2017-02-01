import { HL7Message } from './message';
import { HL7Segment } from './segment';
import { HL7Field } from './field';
import { HL7Component } from './hl7Component';
import { HL7SubComponent } from './hl7SubComponent';

export class Parser {

    public messageParse(messageValue: string, Messages: Object[]) {
        let messageArray = messageValue.split(/[\s](?=MSH)/);
        messageArray.forEach(element => {
            Messages.push(new HL7Message(element));
        });
    }

    public segmentParse(segmentValue: string, messageEncodingChars, Segments: Object[]) {
        let fieldSeperator = messageEncodingChars.substr(0, 1); // Typically |
        let segmentSplit = new RegExp('[\\s](?=[A-Z][A-Z][A-Z,0-9][\\' + fieldSeperator + '])');
        let segmentArray = segmentValue.split(segmentSplit);
        segmentArray.forEach((segmentElement, segmentIndex) => {
            segmentElement = segmentElement.trim();
            Segments.push(new HL7Segment(segmentElement, messageEncodingChars));
        });
    }

    public fieldParse(segmentValue: string, Fields: Object[], messageEncodingChars: string) {
        let fieldSeperator = messageEncodingChars.substr(0, 1);
        let fieldSplit = new RegExp('[\\' + fieldSeperator + ']');
        let fieldArray = segmentValue.split(fieldSplit).slice(1);
        if (segmentValue.substring(0, 3) === 'MSH') {
            fieldArray.unshift(fieldSeperator);
        }
        fieldArray.forEach((fieldElement, fieldIndex) => {
            Fields.push(new HL7Field(fieldElement, fieldIndex + 1, messageEncodingChars));
        });
    }

    public hl7ComponentParse(fieldValue: string, fieldIndex: number, messageEncodingChars: string,
        RepeatedFields: Object[], HL7Components: Object[]) {
        let repeatSeperator = messageEncodingChars.substr(2, 1);
        let repeatSplit = new RegExp('[\\' + repeatSeperator + ']'); // Typically ~
        let repeatArray = fieldValue.split(repeatSplit);
        if (repeatArray.length > 1) { // Only pushes to repeatArray when a ~ is found.
            repeatArray.forEach((repeatElement, repeatIndex) => {
                RepeatedFields.push(new HL7Field(repeatElement, fieldIndex, messageEncodingChars));
            });
        } else {
            let hl7ComponentSeperator = messageEncodingChars.substr(1, 1); // Typically ^
            let hl7ComponentSplit = new RegExp('[\\' + hl7ComponentSeperator + ']');
            let hl7ComponentArray = fieldValue.split(hl7ComponentSplit);
            hl7ComponentArray.forEach((hl7ComponentElement, hl7ComponentIndex) => {
                HL7Components.push(new HL7Component(hl7ComponentElement, hl7ComponentIndex, messageEncodingChars));
            });
        }
    }

    public hl7SubComponentParse(subComponentValue: string, subComponentIndex: number, messageEncodingChars: string,
        HL7SubComponents: Object[]) {
        let hl7SubComponentSeperator = messageEncodingChars.substr(4, 1);
        let hl7SubCompnentSplit = new RegExp('[\\' + hl7SubComponentSeperator + ']');
        let hl7SubComponentArray = subComponentValue.split(hl7SubCompnentSplit);
        hl7SubComponentArray.forEach((hl7SubComponentElement, hl7SubComponentIndex) => {
            HL7SubComponents.push(new HL7SubComponent(hl7SubComponentElement, hl7SubComponentIndex));
        });

    }
}
