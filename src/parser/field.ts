import { Component } from './component';

export class Field {
    Components: Component[] = [];
    RepeatedFields: Field[] = [];
    Index: number;
    Value: string;
    HasRepetition: boolean;
    HasComponents: boolean;
    isHighlighted: boolean;

    constructor(field: string, fieldIndex: number) {
        this.Parse(field, fieldIndex);
        this.Value = field;
    }

    Parse(field: string, fieldIndex: number) {
        this.Index = fieldIndex;
        let repeatArray = field.split(/[~]/);
        if (repeatArray.length > 1) { // Only pushes to repeatArray when a ~ is found.
            repeatArray.forEach((repeatElement, repeatIndex) => {
                this.RepeatedFields.push(new Field(repeatElement, fieldIndex));
            });
        }
        let componentArray = field.split(/[\^]/);
        componentArray.forEach((componentElement, componentIndex) => {
            this.Components.push(new Component(componentElement, componentIndex + 1));
        });
        this.HasRepetition = this.RepeatedFields.length > 0;
        this.HasComponents = this.Components.length > 0;
    }
}
