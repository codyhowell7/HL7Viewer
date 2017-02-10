import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgRedux } from 'ng2-redux';

import { IMessage, IAppState } from '../../states/states';
import { MODE_CHANGED, SWITCH_MESSAGE } from '../../constants/constants';
import { WorkspaceMode } from '../../enums/enums';

@Component({
  selector: 'hls-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  message: IMessage;

  constructor(private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {

      this.ngRedux.dispatch({
        type: SWITCH_MESSAGE,
        payload: {
          id: params['id'] ? +params['id'] : 0
        }
      });
    });

    this.ngRedux.dispatch({
      type: MODE_CHANGED,
      payload: {
        mode: WorkspaceMode.messages
      }
    });
  }
}
