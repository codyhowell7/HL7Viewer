import { Component, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Map } from 'immutable';

import { IMessage, IAppState } from '../../states/states';
import { WorkspaceMode } from '../../enums/enums';
import { ADD_MESSAGE, SWITCH_MESSAGE } from '../../constants/constants';

@Component({
  selector: 'hls-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @select(['workspace', 'workspaceMode']) mode$: Observable<WorkspaceMode>;
  @select(['messages']) messages$: Observable<Map<string, IMessage>>;

  isMessages$: Observable<boolean>;
  isCompare$: Observable<boolean>;

  messageCount$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.messageCount$ = this.messages$.map(messages => messages.filter(message => !message.deleted).size);

    this.isMessages$ = combineLatest(this.mode$, this.messageCount$)
      .map(([mode, messageCount]) => { return mode === WorkspaceMode.messages; });
    this.isCompare$ = combineLatest(this.mode$, this.messageCount$)
      .map(([mode, messageCount]) => { return mode === WorkspaceMode.compare && messageCount > 1; });
  }

  getMessages() {
    return this.messages$.map(messages =>
      messages.filter(message => !message.deleted).toArray().sort(function (a, b) { return a.id - b.id; }));
  };

  addMessage = () => {
    this.ngRedux.dispatch({
      type: ADD_MESSAGE,
      payload: {
        message: ''
      }
    });
  }
}
