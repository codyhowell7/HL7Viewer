import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { List, Map } from 'immutable';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'hls-quick-view-select-all',
  templateUrl: './quick-view-select-all.component.html',
  styleUrls: ['./quick-view-select-all.component.scss']
})
export class QuickViewSelectAllComponent implements OnInit {

  @Input() jwt: string;
  @Output() switchBack = new EventEmitter;

  allViews;
  fieldVisible = Map<number, boolean>();
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private quickViewService: QuickViewService) { }

  ngOnInit() {
    this.quickViewService.searchQuickViews(this.jwt).subscribe(
      views => this.allViews = views
    );
  }

  backToMain(viewStatus: boolean) {
    this.switchBack.emit(viewStatus);
  }

  getUserName() {
    return this.jwtHelper.decodeToken(this.jwt).name;
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

}
