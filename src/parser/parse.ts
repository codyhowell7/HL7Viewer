import { HL7Message } from './hl7Message';
import { HL7Segment } from './hl7Segment';
import { HL7Field } from './hl7Field';
import { HL7Component } from './hl7Component';
import { HL7SubComponent } from './hl7SubComponent';
import { ConvertTime } from './convertTime';


export class Parser {
    fieldSeparator: string;
    componentSeparator: string;
    fieldRepetitionSeparator: string;
    subcomponentSeparator: string;
    escapeCharacter: string;
    escapeCharactersRegex: RegExp;

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

    public parseHL7Message(strMessage: string) {
        let hl7Message: HL7Message = new HL7Message(strMessage);
        let separators: string = strMessage.substr(3, 5);
        this.setSeparators(separators);

        let segmentSplitter = new RegExp('[\\s](?=[A-Z][A-Z][A-Z,0-9][\\' + this.fieldSeparator + '])');
        let segmentArray = strMessage.split(segmentSplitter);
        segmentArray.forEach((segmentElement, segmentIndex) => {
            segmentElement = segmentElement.trim();
            hl7Message.hl7Segments.push(this.parseHL7Segment(segmentElement));
        });
        if (hl7Message.hl7Segments.length > 0 && hl7Message.hl7Segments[0].segmentName === 'MSH') {
            hl7Message.hl7MessageType = hl7Message.hl7Segments[0].hl7Fields[8].value;
            hl7Message.hl7MessageControllerId = hl7Message.hl7Segments[0].hl7Fields[9].value;
            hl7Message.hl7MessageDateTime = ConvertTime(hl7Message.hl7Segments[0].hl7Fields[6].value);
        }

        return hl7Message;
    }

    private parseHL7Segment(segmentValue: string) {
        let hl7Segment: HL7Segment = new HL7Segment(segmentValue);
        hl7Segment.segmentName = segmentValue.substr(0, 3);
        let fieldSplitter = new RegExp('[\\' + this.fieldSeparator + ']');
        let fieldArray = segmentValue.split(fieldSplitter).slice(1);
        if (segmentValue.substring(0, 3) === 'MSH') {
            fieldArray.unshift(this.fieldSeparator);
        }
        fieldArray.forEach((fieldElement, fieldIndex) => {
            hl7Segment.hl7Fields.push(this.parseHL7Field(fieldElement, fieldIndex + 1));
        });

        return hl7Segment;
    }

    private parseHL7Field(fieldValue: string, fieldIndex: number) {
        let repetitionSplitter = new RegExp('[\\' + this.fieldRepetitionSeparator + ']');
        let repetitionArray = fieldValue.split(repetitionSplitter);
        if (fieldValue.match(this.escapeCharactersRegex)) {
            fieldValue = this.convertEscapeSequences(fieldValue);
        }
        let hl7Field: HL7Field = new HL7Field(fieldValue, fieldIndex);
        if (repetitionArray.length > 1) {
            if (fieldValue !== this.componentSeparator + this.fieldRepetitionSeparator +
                this.escapeCharacter + this.subcomponentSeparator) {
                repetitionArray.forEach((repeatElement, repeatIndex) => {
                    hl7Field.hl7RepeatedFields.push(this.parseHL7Field(repeatElement, repeatIndex + 1));
                    // Recurssively calls parseHL7Field as each repeatition is it's own field with it's own components etc.
                });
            }
        } else {
            let componentSplitter = new RegExp('[\\' + this.componentSeparator + ']');
            let hl7ComponentArray = fieldValue.split(componentSplitter);
            if (hl7ComponentArray.length > 1) {
                hl7ComponentArray.forEach((hl7ComponentElement, hl7ComponentIndex) => {
                    hl7Field.hl7Components.push(this.parseHL7Component(hl7ComponentElement, hl7ComponentIndex + 1));
                });
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
        if (subComponentArray.length > 1) {
            subComponentArray.forEach((hl7SubComponentElement, hl7SubComponentIndex) => {
                if (hl7SubComponentElement.match(this.escapeCharactersRegex)) {
                    hl7SubComponentElement = this.convertEscapeSequences(hl7SubComponentElement);
                }
                hl7Component.hl7SubComponents.push(new HL7SubComponent(hl7SubComponentElement, hl7SubComponentIndex + 1));
            });
        }
        hl7Component.hasSubComponents = hl7Component.hl7SubComponents.length > 1;
        return hl7Component;
    }
}