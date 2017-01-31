import { Component } from './component';

export class Field {
    Components: Component[] = [];
    RepeatedFields: Field[] = [];
    Index: number;
    Value: string;
    HasRepetition: boolean;
    HasComponents: boolean;
    isHighlighted: boolean;

    constructor(field: string) {
        this.Parse(field);
        this.Value = field;
    }

    Parse(field: string) {
        let repeatArray = field.split(/[~]/);
        if (repeatArray.length > 1) { // Only pushes to repeatArray when a ~ is found.
            repeatArray.forEach((repeatElement, repeatIndex) => {
                this.RepeatedFields.push(new Field(repeatElement));
            });
        }
        let componentArray = field.split(/[\^]/);
        componentArray.forEach((componentElement, componentIndex) => {
            this.Components.push(new Component(componentElement));
        });
        this.HasRepetition = this.RepeatedFields.length > 1;
        this.HasComponents = this.Components.length > 1;
    }
}
