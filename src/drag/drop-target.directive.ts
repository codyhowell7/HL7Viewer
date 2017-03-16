import { Output, EventEmitter, Input, HostListener, Directive, HostBinding } from '@angular/core';
import { DragService } from './drag.service';

export interface DropTargetOptions {
    zone?: string;
}

@Directive({
    selector: '[myDropTarget]'
})
export class DropTargetDirective {
    constructor(private dragService: DragService) {

    }

    @Input()
    set myDropTarget(options: DropTargetOptions) {
        if (options) {
            this.options = options;
        }
    }

    @Output('myDrop') drop = new EventEmitter();

    private options: DropTargetOptions = {};

    @HostListener('dragenter', ['$event'])
    @HostListener('dragover', ['$event'])
    onDragOver(event) {
            event.preventDefault();
            return false;
    }

    @HostListener('drop', ['$event'])
    onDrop(event) {
        const data = JSON.parse(event.dataTransfer.getData('Text'));

        this.drop.next(data);
    }
}