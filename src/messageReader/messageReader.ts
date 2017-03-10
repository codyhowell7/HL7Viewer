import { IMessage, ISearchConditions } from '../app/states/states';
import { HL7Message } from '../parser/hl7Message';
import { HL7Segment } from '../parser/hl7Segment';
import { HL7Field } from '../parser/hl7Field';
import { HL7Component } from '../parser/hl7Component';
import { HL7SubComponent } from '../parser/hl7SubComponent';
import { Map } from 'immutable';


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

    public generalSearch(messages: Map<number, IMessage>, searchValue: string) {
        let messageFilter = Map<number, boolean>().set(0, false);
        messages.forEach((message, messageNum) => {
            if (message.message.hl7CorrectedMessage.search(searchValue) !== -1) {
                console.log(searchValue);
                console.log(message.message.hl7CorrectedMessage.search(searchValue));
                messageFilter = messageFilter.set(messageNum, true);
            } else {
                messageFilter = messageFilter.set(messageNum, false);
            }
        });
        console.log(messageFilter);
        return messageFilter;
    }


    public searchResults(messages: Map<number, IMessage>, search: ISearchConditions): Map<number, boolean> {
        let messageBooleanMap = Map<number, boolean>().set(0, true);
        let searchResults: string;
        messages.forEach((message, messageIndex) => {
            let groupBooleanArray: boolean[] = [];
            search.conditionGroups.forEach(group => {
                let conditionBooleanArray: boolean[] = [];
                group.conditions.forEach(condition => {
                    if (message.message.hl7CorrectedMessage !== '') {
                        searchResults =
                            this.evalFunctionModifers(message.message, search.conditionGroups
                                .get(group.groupID).conditions
                                .get(condition.conditionID).leftValue, condition.functionModifier);
                        conditionBooleanArray = this.evalConditions(condition, conditionBooleanArray, searchResults);
                    } else {
                        conditionBooleanArray.push(false);
                    }
                });
                groupBooleanArray = this.evalGroup(group, conditionBooleanArray, groupBooleanArray);
            });
            messageBooleanMap = messageBooleanMap.set(messageIndex, this.evalSearch(search, groupBooleanArray));
        });
        return messageBooleanMap;
    }

    public evalConditions(condition, booleanArray: boolean[], searchResults: string): boolean[] {
        switch (condition.conditionOperand) {
            case '==':
                booleanArray.push(searchResults.toString() === condition.rightValue.toString());
                return booleanArray;
            case '!=':
                booleanArray.push(searchResults.toString() !== condition.rightValue.toString());
                return booleanArray;
            case 'Like':
                if (condition.rightValue.endsWith('%')) {
                    let beginWord = new RegExp('(' + condition.rightValue.replace('%', '') + ')\\w*');
                    booleanArray.push(searchResults.match(beginWord) != null);
                    return booleanArray;
                } else if (condition.rightValue.startsWith('%')) {
                    let endWord = new RegExp('\\w*(' + condition.rightValue.replace('%', '') + ')');
                    booleanArray.push(searchResults.match(endWord) != null);
                    return booleanArray;
                } else {
                    let elseWord = new RegExp('\\w*(' + condition.rightValue.replace('%', '') + ')\\w*');
                    booleanArray.push(searchResults.match(elseWord) != null);
                    return booleanArray;
                }
            case 'Contains':
                let elseWord = new RegExp('\\w*(' + condition.rightValue + ')\\w*');
                booleanArray.push(searchResults.match(elseWord) != null);
                return booleanArray;
            case '>':
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    booleanArray.push(+searchResults > +condition.rightValue);
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '<':
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    booleanArray.push(+searchResults < +condition.rightValue);
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '>=':
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    booleanArray.push(+searchResults >= +condition.rightValue);
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '<=':
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    booleanArray.push(+searchResults <= +condition.rightValue);
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
        }
    }

    public evalGroup(group, conditionBoolArray: boolean[], groupBooleanArray: boolean[]): boolean[] {
        let pushedBool = false;
        conditionBoolArray.forEach(conditionBool => {
            switch (group.groupOperand) {
                case 'OR':
                    if (conditionBool === true) {
                        groupBooleanArray.push(true);
                        pushedBool = true;
                    }
                    break;
                case 'AND':
                    if (conditionBool === false) {
                        groupBooleanArray.push(false);
                        pushedBool = true;
                        break;
                    }
            }
        });
        if (pushedBool === false) {
            switch (group.groupOperand) {
                case 'OR':
                    groupBooleanArray.push(false);
                    break;
                case 'AND':
                    groupBooleanArray.push(true);
                    break;
            }
        }
        return groupBooleanArray;
    }

    public evalSearch(search, groupBooleanArray: boolean[]): boolean {
        let finalBool = false;
        let boolToAdd = false;
        groupBooleanArray.forEach(groupBool => {
            switch (search.searchOperand) {
                case 'OR':
                    if (groupBool === true) {
                        finalBool = true;
                        boolToAdd = true;
                    } else {
                        finalBool = false;
                    }
                    break;
                case 'AND':
                    if (groupBool === false) {
                        finalBool = true;
                        boolToAdd = false;
                    } else {
                        finalBool = false;
                    }
                    break;
            }
        });
        if (finalBool === false) {
            switch (search.searchOperand) {
                case 'OR':
                    boolToAdd = false;
                    break;
                case 'AND':
                    boolToAdd = true;
                    break;
            }
        }
        return boolToAdd;
    }
    private evalFunctionModifers(message: HL7Message, searchValue: string, modifer: '' | 'Length' | 'Concat') {
        switch (modifer) {
            case '':
                if (this.parseDesignator(message, searchValue)[0] != null) {
                    return this.parseDesignator(message, searchValue)[0].value;
                } else {
                    return '';
                }
            case 'Length':
                if (this.parseDesignator(message, searchValue)[0] != null) {
                    return this.parseDesignator(message, searchValue)[0].value.length;
                } else {
                    return '';
                }

            case 'Concat':
                let concatConditions = searchValue.split(',');
                let literalValue = '';
                let concatedValue = '';
                concatConditions.forEach(single => {
                    if (this.parseDesignator(message, single.trim())[0] != null) {
                        concatedValue += this.parseDesignator(message, single.trim())[0].value;
                    }
                });
                return concatedValue;
        }
    }

    public compareDesignatorSearch(messages: Map<number, IMessage>, specificDesignator: string): Object[] {
        let resultsArray: Object[] = [];
        messages.forEach((message, messageIndex) => {
            let objectToAdd = this.parseDesignator(message.message, specificDesignator)[0];
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
                    fieldObj = segmentObj.hl7Fields[fieldNumber - 1].hl7RepeatedFields[repeatNumber];
                } if (fieldNumber != null && repeatNumber != null && segmentObj.hl7Fields[fieldNumber - 1].hasRepetition === false) {
                    return;
                } if (fieldNumber != null && repeatNumber == null) {
                    fieldObj = segmentObj.hl7Fields[fieldNumber - 1];
                } if (fieldNumber != null) {
                    if (componentNumber != null) {
                        componentObj = fieldObj.hl7Components[componentNumber - 1];

                        if (subComponentNumber != null) {
                            subComponentObj = componentObj.hl7SubComponents[subComponentNumber - 1];
                            finalObj = [subComponentObj, message.hl7MessageId];
                            return;
                        } else {
                            finalObj = [componentObj, message.hl7MessageId];
                            return;
                        }
                    } else {
                        finalObj = [fieldObj, message.hl7MessageId];
                        return;
                    }
                } else {
                    finalObj = [segmentObj, message.hl7MessageId];
                    return;
                }
            } else {
                return;
            }
        });
        // If the last digit is a 1, we can assume the user would also want the previous value if their more
        // specific one doens't exisit. IE. PID.5.1.1 -> PID.5.1 -> PID.5
        if (finalObj != null && typeof (finalObj[0]) === 'undefined' && designator.endsWith('1')) {
            finalObj = this.parseDesignator(message, designator.substr(0, designator.length - 2));
        }
        if (finalObj == null) {
            finalObj = [null, null];
        }
        return finalObj;
    }
}
