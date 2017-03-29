import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { MessageReader } from '../../../../../../messageReader/messageReader';
import { List } from 'immutable';

@Component({
  selector: 'hls-quick-view-edit',
  templateUrl: './quick-view-edit.component.html',
  styleUrls: ['./quick-view-edit.component.scss'],
})
export class QuickViewEditComponent implements OnInit {

  @Input() quickViewId: string;
  @Input() jwt: string;
  @Output() switchBack = new EventEmitter;

  selectedQuickView;
  fieldsValidated = false;
  fieldValError: string;
  newSelectors = List<string>();


  constructor(private quickViewService: QuickViewService) { }

  ngOnInit() {
    this.quickViewService.getQuickViewById(this.jwt, this.quickViewId).subscribe(
      view => {
        view.selectors.forEach(selector => {
          this.newSelectors = this.newSelectors.push(selector);
        });
        this.selectedQuickView = view;
      }
    );

  }

  addView() {
    this.newSelectors = this.newSelectors.push('');
  }

  setValue(index: number, updatedVal: string) {
    this.newSelectors = this.newSelectors.set(index, updatedVal);
    this.fieldsValidated = false;
  }

  removeListValue(index: number) {
    this.newSelectors = this.newSelectors.remove(index);
  }

  validate() {
    let checkSeg: number[] = [];
    this.newSelectors.forEach(field => {
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

  saveView() {
    this.quickViewService.replaceSelectors(this.newSelectors, this.jwt, this.quickViewId);
    console.log(this.jwt);
    this.switchBack.emit(false);

  }

  updateName(newName: string) {
    this.quickViewService.changeName(newName, this.jwt, this.quickViewId);
  }

  delete() {
    this.quickViewService.deleteView(this.jwt, this.quickViewId);
    this.switchBack.emit(false);
  }

  back() {
    this.switchBack.emit(false);
  }

  trackBy(index, condition) {
    return condition ? condition.conditionID : undefined;
  }

}
