import { IMessage, ISearchConditions } from '../app/states/states';
import { HL7Message } from '../parser/hl7Message';
import { HL7Segment } from '../parser/hl7Segment';
import { HL7Field } from '../parser/hl7Field';
import { HL7Component } from '../parser/hl7Component';
import { HL7SubComponent } from '../parser/hl7SubComponent';
import { Map } from 'immutable';


export class MessageReader {

    public setQuickView(message: IMessage, sectionDesignators: string[]) {
        let generalDesignator: string;
        let results = Map<string, string[]>();
        let designatorResults = [];
        let valueInField;
        sectionDesignators.forEach(designator => {
            valueInField = this.parseDesignator(message.message, designator);
            valueInField.forEach(value => {
                if (value && value.value != null) {
                    designatorResults.push(value.value);
                }
            });
            results = results.set(designator, designatorResults);
            designatorResults = [];
        });
        return results;
    }

    public generalSearch(messages: Map<number, IMessage>, searchValue: string) {
        let messageFilter = Map<number, boolean>().set(0, false);
        messages.forEach((message, messageNum) => {
            if (message.message.hl7CorrectedMessage.search(searchValue) !== -1) {
                messageFilter = messageFilter.set(messageNum, true);
            } else {
                messageFilter = messageFilter.set(messageNum, false);
            }
        });
        return messageFilter;
    }


    public searchResults(messages: Map<number, IMessage>, search: ISearchConditions): Map<number, boolean> {
        let messageBooleanMap = Map<number, boolean>().set(0, true);
        let searchResults: string[];
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

    public evalConditions(condition, booleanArray: boolean[], searchResults: string[]): boolean[] {
        switch (condition.conditionOperand) {
            case '==':
                let eqTempArray: boolean[] = [];
                searchResults.forEach(result => {
                    if (result.toString() === condition.rightValue.toString()) {
                        eqTempArray.push(true);
                    } else {
                        eqTempArray.push(false);
                    }
                });
                booleanArray.push(eqTempArray.some(checkResults => checkResults === true));
                return booleanArray;
            case '!=':
                let neqTempArray: boolean[] = [];
                searchResults.forEach(result => {
                    if (result.toString() !== condition.rightValue.toString()) {
                        neqTempArray.push(true);
                    } else {
                        neqTempArray.push(false);
                    }
                });
                booleanArray.push(neqTempArray.some(checkResults => checkResults === true));
                return booleanArray;
            case 'Like':
                let replace = /%/g;
                let likeTempArray: boolean[] = [];
                if (condition.rightValue.endsWith('%') && !condition.rightValue.startsWith('%')) {
                    let beginWord = new RegExp('(' + condition.rightValue.replace(replace, '') + ')\\w*');
                    searchResults.forEach(result => {
                        if (result.match(beginWord) != null) {
                            likeTempArray.push(true);
                        } else {
                            likeTempArray.push(false);
                        }
                    });
                    booleanArray.push(likeTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                } else if (condition.rightValue.startsWith('%') && !condition.rightValue.endsWith('%')) {
                    let replace = /%/g;
                    let endWord = new RegExp('\\w*(' + condition.rightValue.replace(replace, '') + ')');
                    searchResults.forEach(result => {
                        if (result.match(endWord) != null) {
                            likeTempArray.push(true);
                        } else {
                            likeTempArray.push(false);
                        }
                    });
                    booleanArray.push(likeTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                } else {
                    let replace = /%/g;
                    let elseWord = new RegExp('\\w*(' + condition.rightValue.replace(replace, '') + ')\\w*');
                    searchResults.forEach(result => {
                        if (result.match(elseWord) != null) {
                            likeTempArray.push(true);
                        } else {
                            likeTempArray.push(false);
                        }
                    });
                    booleanArray.push(likeTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                }
            case 'Contains':
                let containsTempArray: boolean[] = [];
                let elseWord = new RegExp('\\w*(' + condition.rightValue + ')\\w*');
                searchResults.forEach(result => {
                    if (result.match(elseWord) != null) {
                        containsTempArray.push(true);
                    } else {
                        containsTempArray.push(false);
                    }
                });
                booleanArray.push(containsTempArray.some(checkResults => checkResults === true));
                return booleanArray;
            case '>':
                let grtTempArray: boolean[] = [];
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    searchResults.forEach(result => {
                        if (+result > +condition.rightValue) {
                            grtTempArray.push(true);
                        } else {
                            grtTempArray.push(false);
                        }
                    });
                    booleanArray.push(grtTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '<':
                let lessTempArray: boolean[] = [];
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    searchResults.forEach(result => {
                        if (+result < +condition.rightValue) {
                            lessTempArray.push(true);
                        } else {
                            lessTempArray.push(false);
                        }
                    });
                    booleanArray.push(lessTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '>=':
                let grtEqTempArray: boolean[] = [];
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    searchResults.forEach(result => {
                        if (+result >= +condition.rightValue) {
                            grtEqTempArray.push(true);
                        } else {
                            grtEqTempArray.push(false);
                        }
                    });
                    booleanArray.push(grtEqTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
            case '<=':
                let lessEqTempArray: boolean[] = [];
                if (typeof (+searchResults) === 'number' && typeof (+condition.rightValue) === 'number') {
                    searchResults.forEach(result => {
                        if (+result >= +condition.rightValue) {
                            lessEqTempArray.push(true);
                        } else {
                            lessEqTempArray.push(false);
                        }
                    });
                    booleanArray.push(lessEqTempArray.some(checkResults => checkResults === true));
                    return booleanArray;
                }
                booleanArray.push(false);
                return booleanArray;
        }
    }

    public evalGroup(group, conditionBoolArray: boolean[], groupBooleanArray: boolean[]): boolean[] {
        let pushedBool = false;
        switch (group.groupOperand) {
            case 'OR':
                groupBooleanArray.push(conditionBoolArray.some(someCondition => someCondition === true));
                break;
            case 'AND':
                groupBooleanArray.push(conditionBoolArray.every(everyCondition => everyCondition === true));
                break;
        }
        return groupBooleanArray;
    }

    public evalSearch(search, groupBooleanArray: boolean[]): boolean {
        let finalBool = false;
        switch (search.searchOperand) {
            case 'OR':
                finalBool = groupBooleanArray.some(someGroup => someGroup === true);
                break;
            case 'AND':
                finalBool = groupBooleanArray.every(everyGroup => everyGroup === true);
                break;
        }
        return finalBool;
    }

    private evalFunctionModifers(message: HL7Message, searchValue: string, modifer: '' | 'Length') {
        switch (modifer) {
            case '':
                let noFuncResultsArray: string[] = [];
                let noFuncFieldToEval = this.parseDesignator(message, searchValue);
                if (noFuncFieldToEval != null) {
                    noFuncFieldToEval.forEach(eachFound => {
                        noFuncResultsArray.push(eachFound.value);
                    });
                    return noFuncResultsArray;
                } else {
                    return [];
                }
            case 'Length':
                let lengthResultsArray: string[] = [];
                let lengthFieldToEval = this.parseDesignator(message, searchValue);
                if (lengthFieldToEval != null) {
                    lengthFieldToEval.forEach(eachFound => {
                        lengthResultsArray.push(eachFound.value.length);
                    });
                    return lengthResultsArray;
                } else {
                    return [];
                }
        }
    }

    public compareDesignatorSearch(messages: Map<number, IMessage>, specificDesignator: string): Object[] {
        let resultsArray: Object[] = [];
        messages.forEach((message, messageIndex) => {
            let objectToAdd = this.parseDesignator(message.message, specificDesignator);
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
        let finalObj = [];

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
                            finalObj.push(subComponentObj);
                            return;
                        } else {
                            finalObj.push(componentObj);
                            return;
                        }
                    } else {
                        finalObj.push(fieldObj);
                        return;
                    }
                } else {
                    finalObj.push(segmentObj);
                    return;
                }
            } else {
                return;
            }
        });
        // If the last digit is a 1, we can assume the user would also want the previous value if their more
        // specific one doens't exisit. IE. PID.5.1.1 -> PID.5.1 -> PID.5
        if (finalObj.filter(obj => obj != null).length === 0 && designator.endsWith('1')) {
            finalObj = this.parseDesignator(message, designator.substr(0, designator.length - 2));
        }
        if (finalObj == null) {
            finalObj = [null];
        }
        return finalObj;
    }
}
