import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'hls-menu-toolbar-option',
  templateUrl: './menu-toolbar-option.component.html',
  styleUrls: ['./menu-toolbar-option.component.scss']
})
export class MenuToolbarOptionComponent implements OnInit {

  @Input() iconLabel: string;
  @Input() isHighlighted: boolean;

  @Output() optionClick: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  onOptionClick = () => this.optionClick.emit();

}
