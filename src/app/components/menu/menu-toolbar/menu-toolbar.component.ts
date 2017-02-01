import { Component, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../states/states';
import { WorkspaceMode } from '../../../enums/enums';
import { MODE_CHANGED } from '../../../constants/constants';

@Component({
  selector: 'hls-menu-toolbar',
  templateUrl: './menu-toolbar.component.html',
  styleUrls: ['./menu-toolbar.component.scss']
})
export class MenuToolbarComponent implements OnInit {

  @select(['workspace', 'workspaceMode']) mode$: Observable<WorkspaceMode>;

  isMessages$: Observable<boolean>;
  isCompare$: Observable<boolean>;

  constructor(private ngRedux: NgRedux<IAppState>){ }

  ngOnInit() {

    this.isMessages$ = this.mode$.map((mode) => { return mode === WorkspaceMode.messages; });
    this.isCompare$ = this.mode$.map((mode) => { return mode === WorkspaceMode.compare; });
  }

  messageClicked = () => this.ngRedux.dispatch({
    type: MODE_CHANGED,
    payload: {
      mode: WorkspaceMode.messages
    }
  });

  compareClicked = () => this.ngRedux.dispatch({
    type: MODE_CHANGED,
    payload: {
      mode: WorkspaceMode.compare
    }
  });
}
