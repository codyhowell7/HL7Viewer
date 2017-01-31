import { Field } from './field';

export class Segment {
    Fields: Field[] = [];
    Value: string;
    Name: string;
    isHighlighted: boolean;

    constructor(segment: string) {
        this.Parse(segment);
        this.Value = segment;
        this.Name = segment.substring(0, 3);
    }

    Parse(segment: string) {
        let fieldArray = segment.split(/[|]/);
        if (segment.substring(0, 3) === 'MSH') {
            fieldArray = fieldArray.filter((element, index) => { return index > 0; });
            fieldArray.unshift('|');
        }
        fieldArray.forEach((fieldElement, fieldIndex) => {
            this.Fields.push(new Field(fieldElement, fieldIndex + 1));
        });
    }
}