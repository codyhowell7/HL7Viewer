import { Component, OnInit } from '@angular/core';
import { NgRedux } from 'ng2-redux';

import { IAppState } from '../../states/states';
import { MODE_CHANGED } from '../../constants/constants';
import { WorkspaceMode } from '../../enums/enums';

@Component({
  selector: 'hls-comparespace',
  templateUrl: './comparespace.component.html',
  styleUrls: ['./comparespace.component.scss']
})
export class ComparespaceComponent implements OnInit {

  constructor(private ngRedux: NgRedux<IAppState>){ }

  ngOnInit() {

    this.ngRedux.dispatch({
      type: MODE_CHANGED,
      payload: {
        mode: WorkspaceMode.compare
      }
    });
  }

}
