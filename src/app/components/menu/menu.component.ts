import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Map } from 'immutable';

import { IMessage, IAppState } from '../../states/states';
import { WorkspaceMode } from '../../enums/enums';
import { ADD_MESSAGE, SWITCH_MESSAGE, NEW_SEARCH_MESSAGE, REMOVE_SEARCH_FILTER, SAVE_COMPARE } from '../../constants/constants';

@Component({
  selector: 'hls-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @select(['workspace', 'workspaceMode']) mode$: Observable<WorkspaceMode>;
  @select(['messages']) messages$: Observable<Map<string, IMessage>>;
  @select(['searchFilter']) searchFilter$: Observable<Map<number, boolean>>;

  isMessages$: Observable<boolean>;
  isCompare$: Observable<boolean>;
  messageCount$: Observable<number>;

  searchFilter: Map<number, boolean>;
  checkBoxes = Map<number, boolean>();
  newMessageId: number;
  messagesSize: number;
  constructor(private ngRedux: NgRedux<IAppState>, private router: Router) { }

  ngOnInit() {
    this.messageCount$ = this.messages$.map(messages => {
      this.messagesSize = messages.filter(message => (!message.deleted)).size;
      return messages.filter(message => !message.deleted).size;
    });
    this.isMessages$ = combineLatest(this.mode$, this.messageCount$)
      .map(([mode, messageCount]) => { return mode === WorkspaceMode.messages; });
    this.isCompare$ = combineLatest(this.mode$, this.messageCount$)
      .map(([mode, messageCount]) => { return mode === WorkspaceMode.compare; });

    this.searchFilter$.subscribe(filter => this.searchFilter = filter);
  }

  getMessages() {
    return this.messages$.map(messages =>
      messages.filter(message =>
        !message.deleted && this.searchFilter.get(message.id))
        .toArray()
        .sort(function (a, b) { return a.id - b.id; }));
  };
  
  checkBoxToggle(compareId) {
    this.checkBoxes = this.checkBoxes.set(compareId, !this.checkBoxes.get(compareId));
  }

  isSorted() {
    let numInFilter = 0;
    let deletedNum: number;
    this.searchFilter.forEach(value => { if (value === true) { numInFilter++; } });
    this.messages$.subscribe(messages => deletedNum = messages.filter(message => message.deleted).size);
    numInFilter = numInFilter - deletedNum;
    return !(this.messagesSize === numInFilter);
  }

  removeFilter() {
    this.ngRedux.dispatch({
      type: REMOVE_SEARCH_FILTER
    });
  }

  addMessage = () => {
    this.ngRedux.dispatch({
      type: ADD_MESSAGE,
      payload: {
        message: ''
      }
    });
    this.ngRedux.dispatch({
      type: NEW_SEARCH_MESSAGE
    });
    this.router.navigate([`/workspace/${this.messagesSize - 1}/standard`]);
  }

  compareMessages() {
    this.ngRedux.dispatch({
      type: SAVE_COMPARE,
      payload: {
        compareCheckBoxes: this.checkBoxes
      }
    })
  }

}
