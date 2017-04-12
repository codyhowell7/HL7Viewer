import { Component, Input, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../../../states/states';
import { WorkspaceMode } from '../../../enums/enums';
import { REMOVE_MESSAGE, REMOVE_MESSAGE_FROM_FILTER } from '../../../constants/constants';
import { Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';

@Component({
  selector: 'hls-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() messagesToCompare$: Observable<Map<number, boolean>>;
  @Input() mode$: Observable<WorkspaceMode>;
  @Input() messages$: Observable<Map<string, IMessage>>;
  @Input() message: IMessage;

  isMessages: boolean;
  isCompare: boolean;
  messageCount: number;

  constructor(private ngRedux: NgRedux<IAppState>, private router: ActivatedRoute) { }

  ngOnInit() {
    this.messages$.subscribe(messages => this.messageCount = messages.filter(message => !message.deleted).size);
    this.mode$.subscribe(mode => { this.isMessages = mode === WorkspaceMode.messages && this.messageCount > 1; });
    this.mode$.subscribe(mode => { this.isCompare = mode === WorkspaceMode.compare && this.messageCount > 1; });
  }

  removeItem() {
    this.ngRedux.dispatch({
      type: REMOVE_MESSAGE,
      payload: {
        id: this.message.id
      }
    });

    this.ngRedux.dispatch({
      type: REMOVE_MESSAGE_FROM_FILTER,
      payload: {
        id: this.message.id
      }
    });
  }

  keepLastRoute() {
    let currentRoute;
    this.router.children[0].url.subscribe(route => currentRoute = route[0].path);
    return currentRoute;
  }
}
