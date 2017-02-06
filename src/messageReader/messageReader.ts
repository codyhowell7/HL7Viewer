import { HL7Message } from '../parser/hl7Message';
import { HL7Segment } from '../parser/hl7Segment';
import { HL7Field } from '../parser/hl7Field';
import { HL7Component } from '../parser/hl7Component';
import { HL7SubComponent } from '../parser/hl7SubComponent';

export class MessageReader {

    public setQuickView(messages: HL7Message[], sectionDesignators: string[]) {
        let generalDesignator: string;
        messages.forEach((message, messageIndex) => {
            sectionDesignators.forEach(designator => {
                let objectToUpdate = this.parseDesignator(message, designator);
                if (typeof (objectToUpdate) !== 'undefined') {
                    objectToUpdate.isInQuickView = true;
                } else {
                    console.log(`${designator} did not exist in message ${messageIndex + 1}`);
                }
            });
        });
    }

    public specificDesignatorSearch(messages: HL7Message[], specificDesignator: string): Object[] {
        let resultsArray: Object[] = [];
        messages.forEach((message, messageIndex) => {
            let objectToAdd = this.parseDesignator(message, specificDesignator);
            if (typeof (objectToAdd) !== 'undefined') {
                resultsArray.push(objectToAdd);
            } else {
                console.log(`${specificDesignator} did not exist in message ${messageIndex + 1}`);
            }
        });
        return resultsArray;
    }

    private parseDesignator(message: HL7Message, designator: string): any {
        let fieldNumber: number;
        let componentNumber: number;
        let subComponentNumber: number;
        let repeatNumber: number;

        let segmentObj: HL7Segment;
        let fieldObj: HL7Field;
        let componentObj: HL7Component;
        let subComponentObj: HL7SubComponent;
        let finalObj;

        let messageSections = designator.split('.');
        let segmentName = messageSections[0];
        if (messageSections[1] != null) {
            // Account for repitition
            if (messageSections[1].includes('[')) {
                repeatNumber = Number(messageSections[1].substring(messageSections[1].indexOf('[') + 1, messageSections[1].indexOf(']')));
                fieldNumber = Number(messageSections[1].split('[')[0]);
            } else {
                fieldNumber = Number(messageSections[1]);
            }

            if (messageSections[2] != null) {
                componentNumber = Number(messageSections[2]);

                if (messageSections[3] != null) {
                    subComponentNumber = Number(messageSections[3]);
                }
            }
        }

        message.hl7Segments.forEach((segment, segmentIndex) => {
            if (segment.segmentName === segmentName) {
                segmentObj = segment;

                if (fieldNumber != null && repeatNumber != null && segmentObj.hl7Fields[fieldNumber - 1].hasRepetition) {
                    fieldObj = segmentObj.hl7Fields[fieldNumber - 1].hl7RepeatedFields[repeatNumber - 1];
                } if (fieldNumber != null && repeatNumber != null && segmentObj.hl7Fields[fieldNumber - 1].hasRepetition === false) {
                    return;
                } if (fieldNumber != null && repeatNumber == null) {
                    fieldObj = segmentObj.hl7Fields[fieldNumber - 1];
                } if (fieldNumber != null) {
                    if (componentNumber != null) {
                        componentObj = fieldObj.hl7Components[componentNumber - 1];

                        if (subComponentNumber != null) {
                            subComponentObj = componentObj.hl7SubComponents[subComponentNumber - 1];
                            finalObj = subComponentObj;
                            return;
                        } else {
                            finalObj = componentObj;
                            return;
                        }
                    } else {
                        finalObj = fieldObj;
                        return;
                    }
                } else {
                    finalObj = segmentObj;
                    return;
                }
            } else {
                return;
            }
        });
        // If the last digit is a 1, we can assume the user would also want the previous value if their more
        // specific one doens't exisit. IE. PID.5.1.1 -> PID.5.1 -> PID.5
        if (typeof (finalObj) === 'undefined' && designator.endsWith('1')) {
            finalObj = this.parseDesignator(message, designator.substr(0, designator.length - 2));
        }
        return finalObj;
    }
}
