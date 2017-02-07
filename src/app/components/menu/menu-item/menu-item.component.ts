import { Component, Input, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Map } from 'immutable';

import { IMessage, IAppState } from '../../../states/states';
import { WorkspaceMode } from '../../../enums/enums';

import { REMOVE_MESSAGE } from '../../../constants/constants';

@Component({
  selector: 'hls-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @select(['workspace', 'workspaceMode']) mode$: Observable<WorkspaceMode>;
  @select(['messages']) messages$: Observable<Map<string, IMessage>>;

  @Input() message: IMessage;

  isMessages$: Observable<boolean>;
  isCompare$: Observable<boolean>;

  messageCount$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>){ }

  ngOnInit() {
    
    this.messageCount$ = this.messages$.map(messages => messages.filter(message => !message.deleted).size);

    this.isMessages$ = combineLatest(this.mode$, this.messageCount$).map(([mode, messageCount]) => { return mode === WorkspaceMode.messages && messageCount > 1; });
    this.isCompare$ = combineLatest(this.mode$, this.messageCount$).map(([mode, messageCount]) => { return mode === WorkspaceMode.compare && messageCount > 1; });
  }

  removeItem = () => this.ngRedux.dispatch({
    type: REMOVE_MESSAGE,
    payload: {
      id: this.message.id
    }
  });

}
