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
import { Clipboard } from 'ts-clipboard';
import { NotificationsService } from 'angular2-notifications';

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

  isMessages: boolean;
  isCompare: boolean;
  messageCount: number;

  searchFilter: Map<number, ISearchFilter>;
  checkBoxes = Map<number, boolean>();
  newMessageId: number;
  messagesSize: number;
  messages: Map<string, IMessage>;
  formattedMessages: IMessage[];
  activeMessage: number;
  deleted: number;
  searched = false;
  fileLoaded = false;
  currentRoute = 0;
  copyOption = false;
  copyListOption = false;
  copySelectOption = false;
  maxMess: number;

  constructor(private ngRedux: NgRedux<IAppState>, private router: Router, private aRouter: ActivatedRoute,
    private _service: NotificationsService) { }

  ngOnInit() {
    this.searchFilter$.subscribe(filter => this.searchFilter = filter);
    this.messages$.subscribe(messages => {
      this.messagesSize = messages.filter(message => (!message.deleted)).size;
      this.maxMess = messages.size;
      this.getMessages(messages);
    });
    this.mode$.subscribe(mode => {
      this.isMessages = mode === WorkspaceMode.messages;
      this.isCompare = mode === WorkspaceMode.compare;
    });
    this.aRouter.url.subscribe(aurl => {
      if (aurl[1]) {
        this.currentRoute = +aurl[1].path;
      }
    });
  }

  getMessages(messages: Map<string, IMessage>) {
    this.formattedMessages = messages.filter(message => {
      return !message.deleted && this.searchFilter.get(message.id).includedInMess;
    })
      .toArray()
      .sort(function (a, b) { return a.id - b.id; });
  };

  checkMessageOne() {
    if (this.formattedMessages[0].message.hl7CorrectedMessage != null || this.formattedMessages.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  checkBoxToggle(compareId) {
    this.checkBoxes = this.checkBoxes.set(compareId, !this.checkBoxes.get(compareId));
  }

  isSorted() {
    if (this.searchFilter.first().searchTerm !== '') {
      return true;
    } else {
      return false;
    }
  }

  addMessage() {

    this.ngRedux.dispatch({
      type: NEW_SEARCH_MESSAGE,
      payload: {
        searchId: this.maxMess
      }
    });
    this.ngRedux.dispatch({
      type: ADD_MESSAGE,
      payload: {
        message: ''
      }
    });
    this.ngRedux.dispatch({
      type: SWITCH_MESSAGE,
      payload: {
        id: this.maxMess - 1
      }
    });
    this.router.navigate([`/workspace/${this.maxMess - 1}/standard`]);
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
    this.activeMessage = null;
    this.fileLoaded = false;
    this.copyOption = false;
    this.copyListOption = false;
    this.copySelectOption = false;
    this.ngRedux.dispatch({
      type: RESET_STATE,
    });
    this.ngRedux.dispatch({
      type: RESET_STATE,
    });
    this.router.navigate(['workspace/0/standard']);
  }

  fileChanged(event) {
    this.fileLoaded = true;
    let fileReader: FileReader = new FileReader();
    let file: File = event.srcElement.files[0];
    let parsedMessage;
    fileReader.onloadend = () => {
      parsedMessage = new HL7MultiMessage(fileReader.result, 0).hl7Messages;

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

  copyMessages() {
    this.copyOption = true;
  }

  copyList() {
    this.copyListOption = true;
  }

  copySelect() {
    this.copySelectOption = true;
  }

  allFullCopy() {
    let allMessage = '';
    this.formattedMessages.forEach(message => {
      allMessage += message.message.hl7CorrectedMessage + '\n';
    });
    Clipboard.copy(allMessage);
    this.copyListOption = false;
    this.copyOption = false;
    this._service.success('Copy Successful!', 'Copied current list of messages.');
  }

  allPHICopy() {
    let allMessage = '';
    this.formattedMessages.forEach(message => {
      allMessage += message.message.hl7MessageNoPHI + '\n';
    });
    Clipboard.copy(allMessage);
    this.copyListOption = false;
    this.copyOption = false;
    this._service.success('Copy Successful!', 'Copied current list of messages, without PHI.');

  }

  selectFullCopy() {

  }

}
