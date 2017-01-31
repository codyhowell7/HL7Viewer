export class SubComponent {
    Index: number;
    Value: string;
    isHighlighted: boolean;

    constructor(subComponent: string, subComponentIndex: number) {
        this.Value = subComponent;
        this.Index = subComponentIndex;
    }
}
