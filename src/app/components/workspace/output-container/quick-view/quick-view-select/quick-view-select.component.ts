import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { IMessage } from '../../../../../states/states';
import { List, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'hls-quick-view-select',
  templateUrl: './quick-view-select.component.html',
  styleUrls: ['./quick-view-select.component.scss']
})
export class QuickViewSelectComponent implements OnInit {

  @Input() jwt: string;
  @Input() messages$: Observable<Map<number, IMessage>>;
  @Input() currentMessage$: Observable<number>;
  @Output() switchBack = new EventEmitter;

  jwtHelper: JwtHelper = new JwtHelper();
  fieldVisible = Map<number, boolean>();
  userViews;
  useQV: string;
  showUse: boolean;
  showEdit: boolean;

  constructor(private quickViewService: QuickViewService) { }

  ngOnInit() {
    this.quickViewService.getQuickViewsForUser(this.jwt, this.getCurrentUserId()).subscribe(
      views => {
        this.userViews = views;
      });
  }
  
  backToMain(viewStatus: boolean) {
    this.switchBack.emit(viewStatus);
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.jwt).sub;
  }

  showFields(QvId: number) {
    this.fieldVisible = this.fieldVisible.set(QvId, true);
  }

  hideFields(QvId: number) {
    this.fieldVisible = this.fieldVisible.set(QvId, false);
  }

  fieldsVisible(QvId: number) {
    if (this.fieldVisible.get(QvId)) {
      return this.fieldVisible.get(QvId);
    } else {
      return false;
    }
  }

  useQuickView(id: string) {
    this.useQV = id;
    this.showUse = true;
    this.showEdit = false;
  }

  editQuickView(id: string) {
    this.useQV = id;
    this.showEdit = true;
    this.showUse = false;
  }

  changeView(changeView: boolean) {
    this.showUse = changeView;
    this.showEdit = changeView;
  }

  showSelect() {
    if (!this.useQV || (this.showUse === false && this.showEdit === false)) {
      return true;
    } else {
      return false;
    }
  }

}
