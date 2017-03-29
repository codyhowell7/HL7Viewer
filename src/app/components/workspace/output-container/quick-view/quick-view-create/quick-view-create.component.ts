import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { List } from 'immutable';
const uuidV1 = require('uuid/v1');

@Component({
  selector: 'hls-quick-view-create',
  templateUrl: './quick-view-create.component.html',
  styleUrls: ['./quick-view-create.component.scss']
})
export class QuickViewCreateComponent implements OnInit {

  @Input() jwt: string;

  @Output() switchBack = new EventEmitter;

  name: string;
  currentViews: List<string> = List(['']);
  fieldsValidated = false;
  fieldValError: string;

  ngOnInit() { }

  constructor(private quickViewService: QuickViewService) { }

  saveName(input: string) {
    this.name = input;
  }

  saveView() {
    this.quickViewService.createQuickView(this.name, this.currentViews, this.jwt, uuidV1());
    this.switchBack.emit(false);
    this.fieldsValidated = false;
  }

  validateFields() {
    let checkSeg: number[] = [];
    this.currentViews.forEach(field => {
      if (field.length < 3) {
        checkSeg.push(0);
      } else if (field.length > 4) {
        if (field.indexOf('.') === -1) {
          checkSeg.push(0);
        }
      } else {
        checkSeg.push(field.substr(0, 3).search(/[.]/));
      }
    });
    if (checkSeg.filter(value => value !== -1).length > 0 && (name === '' || name == null)) {
      this.fieldsValidated = false;
      this.fieldValError = 'Please ensure all fields are 3 characters long and the quick view has a name';
    } else {
      this.fieldsValidated = true;
      this.fieldValError = '';
    }
  }

  getListValue(index: number) {
    return this.currentViews.get(index);
  }

  saveListValue(value: string, index: number) {
    this.currentViews = this.currentViews.set(index, value.toLocaleUpperCase());
    this.fieldsValidated = false;
  }

  addView() {
    this.currentViews = this.currentViews.push('');
    this.fieldsValidated = false;
  }

  backToMain() {
    this.switchBack.emit(false);
    this.fieldsValidated = false;
  }

  trackFields(index, field) {
    return field ? field.id : undefined;
  }

  removeListValue(index: number) {
    this.currentViews = this.currentViews.delete(index);
  }

}
