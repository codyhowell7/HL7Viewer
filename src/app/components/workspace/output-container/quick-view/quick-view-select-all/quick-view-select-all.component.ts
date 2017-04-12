import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { List, Map } from 'immutable';
import { IMessage } from '../../../../../states/states';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'hls-quick-view-select-all',
  templateUrl: './quick-view-select-all.component.html',
  styleUrls: ['./quick-view-select-all.component.scss']
})
export class QuickViewSelectAllComponent implements OnInit {

  @Input() jwt: string;
  @Input() messages$: Observable<Map<number, IMessage>>;
  @Input() currentMessage$: Observable<number>;
  @Output() switchBack = new EventEmitter;

  allViews;
  fieldVisible = Map<number, boolean>();
  jwtHelper: JwtHelper = new JwtHelper();
  useQV: string;
  showUse: boolean;
  userSelected = false;
  nameSelected = true;
  byUser = '';
  byName = '';

  constructor(private quickViewService: QuickViewService) { }

  ngOnInit() {
    this.quickViewService.searchQuickViews(this.jwt).subscribe(
      views => this.allViews = views
    );
  }

  backToMain(viewStatus: boolean) {
    this.switchBack.emit(viewStatus);
  }

  getCurrentViews() {
    let views = this.allViews;
    if (this.nameSelected === true && views) {
      return views.filter(view => view.name.toLowerCase().includes(this.byName.toLowerCase()));
    } else if (this.userSelected === true && views) {
      return views.filter(view => view.userName.toLowerCase().includes(this.byUser.toLowerCase()));
    } else {
      return views;
    }
  }

  updateSearchOption(optionSelected) {
    switch (optionSelected) {
      case 'By Name:':
        this.nameSelected = true;
        this.userSelected = false;
        this.byName = this.byUser;
        this.byUser = '';
        break;
      case 'By User:':
        this.nameSelected = false;
        this.userSelected = true;
        this.byUser = this.byName;
        this.byName = '';
        break;
    }
  }

  searchFor(searchString: string) {
    if (this.userSelected === true) {
      this.byUser = searchString;
      this.byName = '';
    } else if (this.nameSelected === true) {
      this.byName = searchString;
      this.byUser = '';
    }
  }

  getUserName(currentView) {
    return currentView.userName.substring(0, currentView.userName.indexOf('@'));
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
  }

  changeView(changeView: boolean) {
    this.showUse = changeView;
    this.byUser = '';
    this.byName = '';
  }

  showSelect() {
    if (!this.useQV || this.showUse === false) {
      return true;
    } else {
      return false;
    }
  }
}
