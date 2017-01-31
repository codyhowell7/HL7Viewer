import { SubComponent } from './subComponent';

export class Component {
    SubComponents: SubComponent[] = [];
    Index: number;
    Value: string;
    HasSubComponents: boolean;
    isHighlighted: boolean;

    constructor(component: string, componentIndex: number) {
        this.Parse(component, componentIndex);
        this.Value = component;
    }

    Parse(component: string, componentIndex: number) {
        this.Index = componentIndex;
        let subComponentArray = component.split(/[&]/);
        subComponentArray.forEach((subComponentElement, subComponentIndex) => {
            this.SubComponents.push(new SubComponent(subComponentElement, subComponentIndex + 1));
        });
        this.HasSubComponents = this.SubComponents.length > 1;
    }
}
