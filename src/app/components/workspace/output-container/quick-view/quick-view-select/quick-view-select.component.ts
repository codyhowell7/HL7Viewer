import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { IMessage } from '../../../../../states/states';
import { List, Map } from 'immutable';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'hls-quick-view-select',
  templateUrl: './quick-view-select.component.html',
  styleUrls: ['./quick-view-select.component.scss']
})
export class QuickViewSelectComponent implements OnInit {

  @Input() jwt: string;
  @Output() switchBack = new EventEmitter;

  jwtHelper: JwtHelper = new JwtHelper();
  fieldVisible = Map<number, boolean>();
  userViews;
  useQV: string;

  constructor(private quickViewService: QuickViewService) { }

  ngOnInit() {
    this.quickViewService.getQuickViewsForUser(this.jwt, this.getCurrentUserId()).subscribe(
      views => this.userViews = views
    );
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
  }

}
