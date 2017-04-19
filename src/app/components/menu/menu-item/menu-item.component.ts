import { Component, Input, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../../../states/states';
import { WorkspaceMode } from '../../../enums/enums';
import { REMOVE_MESSAGE, REMOVE_MESSAGE_FROM_FILTER } from '../../../constants/constants';
import { Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { Clipboard } from 'ts-clipboard';
import { NotificationsService } from 'angular2-notifications';

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
  crtlClicked = false;
  shiftClicked = false;

  constructor(private ngRedux: NgRedux<IAppState>, private aRouter: ActivatedRoute, private router: Router, 
  private _service: NotificationsService) { }

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
    this.aRouter.children[0].url.subscribe(route => currentRoute = route[0].path);
    return currentRoute;
  }

  copyValue(valueToCopy) {
    Clipboard.copy(valueToCopy.message.hl7CorrectedMessage);
    this._service.success('Copy Successful!', `Copied Message ${valueToCopy.id + 1}`);
  }

  copyNoPHIValue(valueToCopy) {
      Clipboard.copy(valueToCopy.message.hl7MessageNoPHI);
      this._service.success('Copy Successful!',  `Copied Message ${valueToCopy.id + 1}, without PHI`);
  }
}
