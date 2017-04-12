import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Map } from 'immutable';
import { HL7MultiMessage } from '../../../parser/hl7MultiMessage';

import { IMessage, IAppState, ISearchFilter } from '../../states/states';
import { WorkspaceMode } from '../../enums/enums';
import {
  ADD_MESSAGE, SWITCH_MESSAGE, NEW_SEARCH_MESSAGE, REMOVE_SEARCH_FILTER, SAVE_COMPARE, RESET_STATE,
  CREATE_DEAFULT_SEARCH_BY_SIZE, All_MESSAGE_RECEIVED
} from '../../constants/constants';
import * as Clipboard from 'clipboard';

@Component({
  selector: 'hls-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('fileInput') myFileInput;

  @select(['workspace', 'workspaceMode']) mode$: Observable<WorkspaceMode>;
  @select(['messages']) messages$: Observable<Map<string, IMessage>>;
  @select(['searchFilter']) searchFilter$: Observable<Map<number, ISearchFilter>>;

  isMessages$: Observable<boolean>;
  isCompare$: Observable<boolean>;
  messageCount$: Observable<number>;

  searchFilter: Map<number, ISearchFilter>;
  checkBoxes = Map<number, boolean>();
  newMessageId: number;
  messagesSize: number;
  activeMessage: number;
  deleted: number;
  searched = false;
  fileLoaded = false;
  currentRoute = 0;

  constructor(private ngRedux: NgRedux<IAppState>, private router: Router, private aRouter: ActivatedRoute) { }

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
    this.aRouter.url.subscribe(aurl => {
      if (aurl[1]) {
        this.currentRoute = +aurl[1].path;
      }
    });
  }

  getMessages() {
    return this.messages$.map(messages =>
      messages.slice(0, 100)
        .filter(message =>
          !message.deleted && this.searchFilter.get(message.id).includedInMess)
        .toArray()
        .sort(function (a, b) { return a.id - b.id; }));
  };

  checkBoxToggle(compareId) {
    this.checkBoxes = this.checkBoxes.set(compareId, !this.checkBoxes.get(compareId));
  }

  isSorted() {
    let filterActive = false;
    let deletedNum: number;
    filterActive = this.searchFilter.some(value => value.includedInMess === false);
    return filterActive;
  }

  updateColor(messageId: number) {
    return this.currentRoute === messageId;
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
    });
  }

  resetSession() {
    this.router.navigate(['workspace/0/standard']);
    this.activeMessage = null;
    this.fileLoaded = false;
    this.ngRedux.dispatch({
      type: RESET_STATE,
    });
    this.ngRedux.dispatch({
      type: RESET_STATE,
    });
  }

  fileChanged(event) {
    this.fileLoaded = true;
    let fileReader: FileReader = new FileReader();
    let file: File = event.srcElement.files[0];
    let parsedMessage;
    fileReader.onloadend = () => {
      parsedMessage = new HL7MultiMessage(fileReader.result).hl7Messages;

      this.ngRedux.dispatch({
        type: CREATE_DEAFULT_SEARCH_BY_SIZE,
        payload: {
          messageSize: parsedMessage.size
        }
      });

      this.ngRedux.dispatch({
        type: All_MESSAGE_RECEIVED,
        payload: {
          messages: parsedMessage
        }
      });
    };
    fileReader.readAsText(file);
    this.router.navigate(['workspace', '0', 'find']);
  }

}
