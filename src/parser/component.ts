import { SubComponent } from './subComponent';

export class Component {
    SubComponents: SubComponent[] = [];
    Index: number;
    Value: string;
    HasSubComponents: boolean;
    isHighlighted: boolean;

    constructor(component: string) {
        this.Parse(component);
        this.Value = component;
    }

    Parse(component: string) {
        let subComponentArray = component.split(/[&]/);
        subComponentArray.forEach((element, index) => {
            this.SubComponents.push(new SubComponent(element));
        });
        this.HasSubComponents = this.SubComponents.length > 1;
    }
}
