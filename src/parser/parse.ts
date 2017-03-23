import { HL7Message } from './hl7Message';
import { HL7Segment } from './hl7Segment';
import { HL7Field } from './hl7Field';
import { HL7Component } from './hl7Component';
import { HL7SubComponent } from './hl7SubComponent';
import { ConvertTime } from './convertTime';
let HL7Dict = require('hl7-dictionary');

export class Parser {
    fieldSeparator: string;
    componentSeparator: string;
    fieldRepetitionSeparator: string;
    subcomponentSeparator: string;
    escapeCharacter: string;
    escapeCharactersRegex: RegExp;
    messageVersion: string;

    private setSeparators(messageEncodingChars: string) {
        this.fieldSeparator = messageEncodingChars.substr(0, 1);
        this.componentSeparator = messageEncodingChars.substr(1, 1);
        this.fieldRepetitionSeparator = messageEncodingChars.substr(2, 1);
        this.escapeCharacter = messageEncodingChars.substr(3, 1);
        this.subcomponentSeparator = messageEncodingChars.substr(4, 1);
        this.escapeCharactersRegex = this.setEscapeRegex();
    }

    /////////////////////////////////// Escape Character Section BEGIN /////////////////////////////////////////////////////
    private setEscapeRegex() {
        return new RegExp('(\\' + this.escapeCharacter + 'T\\' + this.escapeCharacter + '|\\' + this.escapeCharacter +
            'R\\' + this.escapeCharacter + '|\\' + this.escapeCharacter + 'F\\' + this.escapeCharacter + '|\\' +
            this.escapeCharacter + 'E\\' + this.escapeCharacter + '|\\' + this.escapeCharacter + 'S\\' + this.escapeCharacter + ')');
        // (\\T\\|\\R\\|\\F\\|\\E\\|\\S\\) => where the second \ in of each pair is replaced with the escape character.
    }

    private convertEscapeSequences(stringToSearch: string) {
        let escapeSequences = [
            // See https://corepointhealth.com/resource-center/hl7-resources/hl7-escape-sequences for resource
            // looking for \F\, \R\, etc. where \ represents the escape character.
            // At this point we know one of these exists so we have to run through the list to check which one.
            {escapeSequence: '(\\' + this.escapeCharacter + 'F' + '\\' + this.escapeCharacter + ')', result: this.fieldSeparator},
            {escapeSequence: '(\\' + this.escapeCharacter + 'R' + '\\' + this.escapeCharacter + ')', result: this.fieldRepetitionSeparator},
            {escapeSequence: '(\\' + this.escapeCharacter + 'S' + '\\' + this.escapeCharacter + ')', result: this.componentSeparator},
            {escapeSequence: '(\\' + this.escapeCharacter + 'T' + '\\' + this.escapeCharacter + ')', result: this.subcomponentSeparator},
            {escapeSequence: '(\\' + this.escapeCharacter + 'E' + '\\' + this.escapeCharacter + ')', result: this.escapeCharacter}
        ];
        let newRegex;
        escapeSequences.forEach(escapeChar => {
            newRegex = new RegExp(escapeChar.escapeSequence);
            stringToSearch = stringToSearch.replace(newRegex, escapeChar.result);
        });
        return stringToSearch;
    }
    /////////////////////////////////// Escape Character Section END /////////////////////////////////////////////////////

    // Creates a new message then splits it by segment.
    // We then pass each segment to the parseHL7Segment function.
    // Parse order: Message -> Segment -> Field -> [RepeatingField]? -> Component -> Subcomponent

    public parseHL7Message(strMessage: string, messageIndex: number) {
        let hl7Message: HL7Message = new HL7Message(strMessage);
        let separators: string = strMessage.substr(3, 5);
        let localSegments: HL7Segment[] = [];
        hl7Message.hl7MessageId = messageIndex + 1;
        this.setSeparators(separators);

        let segmentSplitter = new RegExp('[\\s](?=[A-Z][A-Z][A-Z,0-9][\\\\' + this.fieldSeparator + '])');
        let segmentArray = strMessage.split(segmentSplitter);
        hl7Message.hl7CorrectedMessage = segmentArray.join('\n');
        segmentArray.forEach((segmentElement, segmentIndex) => {
            segmentElement = segmentElement.trim();
            localSegments.push(this.parseHL7Segment(segmentElement, segmentIndex));
        });
        hl7Message.hl7Segments = localSegments;
        if (hl7Message.hl7Segments.length > 0 && hl7Message.hl7Segments[0].segmentName === 'MSH') {
            hl7Message.hl7MessageType = hl7Message.hl7Segments[0].hl7Fields[8].value;
            hl7Message.hl7MessageControllerId = hl7Message.hl7Segments[0].hl7Fields[9].value;
            hl7Message.hl7MessageDateTime = ConvertTime(hl7Message.hl7Segments[0].hl7Fields[6].value);
            hl7Message.hl7Version = hl7Message.hl7Segments[0].hl7Fields[11].value;
            this.messageVersion = hl7Message.hl7Version;
        }

        return hl7Message;
    }

    private parseHL7Segment(segmentValue: string, segmentIndex: number) {
        let segName = segmentValue.substr(0, 3);
        let segDesc = this.segmentDesc(segName);
        let hl7Segment: HL7Segment = new HL7Segment(segmentValue, segmentIndex);
        let localFields: HL7Field[] = hl7Segment.hl7Fields;
        hl7Segment.segmentName = segName;
        hl7Segment.segmentDesc = segDesc;
        let fieldSplitter = new RegExp('[\\' + this.fieldSeparator + ']');
        let fieldArray = segmentValue.split(fieldSplitter).slice(1);
        if (segmentValue.substring(0, 3) === 'MSH') {
            fieldArray.unshift(this.fieldSeparator); // The field seperator is counted as index 1 so we need to put it back in.
        }
        fieldArray.forEach((fieldElement, fieldIndex) => {
            localFields.push(this.parseHL7Field(fieldElement, fieldIndex, segName));
        });
        hl7Segment.hl7Fields = localFields;
        return hl7Segment;
    }

    private segmentDesc(segmentHead: string): string {
        if (typeof HL7Dict.definitions['2.7.1'].segments[segmentHead] === 'undefined' ) {
            throw `Segment name not found: ${segmentHead}`; // TODO: Create Custom
        } else {
            return HL7Dict.definitions['2.7.1'].segments[segmentHead].desc;
        }
    }

    private parseHL7Field(fieldValue: string, fieldIndex: number, currentSegmentName: string) {
        let repetitionSplitter = new RegExp('[\\' + this.fieldRepetitionSeparator + ']');
        let repetitionArray = fieldValue.split(repetitionSplitter);
        if (fieldValue.match(this.escapeCharactersRegex)) {
            fieldValue = this.convertEscapeSequences(fieldValue);
        }
        let hl7Field: HL7Field = new HL7Field(fieldValue, fieldIndex);
        let localRepeatedFields: HL7Field[] = hl7Field.hl7RepeatedFields;
        hl7Field.fieldDesc = HL7Dict.definitions['2.7.1'].segments[currentSegmentName].fields[fieldIndex].desc;
        if (repetitionArray.length > 1) {
            if (fieldValue !== this.componentSeparator + this.fieldRepetitionSeparator +
                this.escapeCharacter + this.subcomponentSeparator) {
                repetitionArray.forEach((repeatElement, repeatIndex) => {
                    localRepeatedFields.push(this.parseHL7Field(repeatElement, repeatIndex, currentSegmentName));
                    // Recurssively calls parseHL7Field as each repeatition is it's own field with it's own components etc.
                });
                hl7Field.hl7RepeatedFields = localRepeatedFields;
            }
        } else {
            let componentSplitter = new RegExp('[\\' + this.componentSeparator + ']');
            let hl7ComponentArray = fieldValue.split(componentSplitter);
            let localComponents: HL7Component[] = hl7Field.hl7Components;
            if (hl7ComponentArray.length > 1) {
                hl7ComponentArray.forEach((hl7ComponentElement, hl7ComponentIndex) => {
                    localComponents.push(this.parseHL7Component(hl7ComponentElement, hl7ComponentIndex));
                });
                hl7Field.hl7Components = localComponents;
            }
        }
        hl7Field.hasRepetition = hl7Field.hl7RepeatedFields.length > 0;
        hl7Field.hasHL7Components = hl7Field.hl7Components.length > 0;
        return hl7Field;
    }

    private parseHL7Component(componentValue: string, componentIndex: number) {
        let subComponentSplitter = new RegExp('[\\' + this.subcomponentSeparator + ']');
        let subComponentArray = componentValue.split(subComponentSplitter);
        if (componentValue.match(this.escapeCharactersRegex)) {
            componentValue = this.convertEscapeSequences(componentValue);
        }
        let hl7Component: HL7Component = new HL7Component(componentValue, componentIndex);
        let localSubComponents: HL7SubComponent[] = hl7Component.hl7SubComponents;
        if (subComponentArray.length > 1) {
            subComponentArray.forEach((hl7SubComponentElement, hl7SubComponentIndex) => {
                if (hl7SubComponentElement.match(this.escapeCharactersRegex)) {
                    hl7SubComponentElement = this.convertEscapeSequences(hl7SubComponentElement);
                }
                localSubComponents.push(new HL7SubComponent(hl7SubComponentElement, hl7SubComponentIndex + 1));
            });
            hl7Component.hl7SubComponents = localSubComponents;
        }
        hl7Component.hasSubComponents = hl7Component.hl7SubComponents.length > 1;
        return hl7Component;
    }
}
