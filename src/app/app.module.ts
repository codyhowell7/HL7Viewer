import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';
import { createStore } from 'redux';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { appRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MessageComponent } from './components/workspace/message/message.component';
import { MessageSegmentComponent } from './components/workspace/message/message-segment/message-segment.component';
import { MenuToolbarComponent } from './components/menu/menu-toolbar/menu-toolbar.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { OutputContainerComponent } from './components/workspace/output-container/output-container.component';
import { OutputTabContainerComponent } from './components/workspace/output-container/output-tab-container/output-tab-container.component';
import { IAppState } from './states/states';
import { WorkspaceMode } from './enums/enums';
import { IAction } from './actions/actions';
import { reduceMessagesToCompare } from './reducers/compareReducers';
import { reduceSearchResults } from './reducers/searchResultReducer';
import { reduceSearchCondition, reduceSearchConditionSize } from './reducers/userSearchReducer';
import { reduceWorkspace } from './reducers/workspaceReducer';
import { reduceMenu } from './reducers/menuReducer';
import { reduceCurrentMessage, reduceMessages } from './reducers/messageReducer';
import { reduceAccordion } from './reducers/accordionReducer';
import { reduceDiscrepancies } from './reducers/discrepancyReducer';
import { reduceJWT } from './reducers/jwtReducer';
import { reduceFindAll, reduceFindAllUnique } from './reducers/findAllReducer';
import { reduceMessageHighlight } from './reducers/messageHighlightReducer';

import { ComparespaceComponent } from './components/comparespace/comparespace.component';
import { QuickViewComponent } from './components/workspace/output-container/quick-view/quick-view.component';
import { SearchComponent } from './components/workspace/output-container/search/search.component';
import { StandardComponent } from './components/workspace/output-container/standard/standard.component';
import { ComparespaceWorkspaceComponent } from './components/comparespace/comparespace-workspace/comparespace-workspace.component';
import {
  ComparespaceHighlightingComponent
} from './components/comparespace/comparespace-workspace/comparespace-highlighting/comparespace-highlighting.component';
import {
  ComparespaceFieldHighlightingComponent
} from './components/comparespace/comparespace-workspace/comparespace-highlighting/comparespace-field-highlighting/comparespace-field-highlighting.component';
import {
  ComparespaceSegmentHighlightingComponent
} from './components/comparespace/comparespace-workspace/comparespace-highlighting/comparespace-segment-highlighting/comparespace-segment-highlighting.component';
import { DragService } from '../drag/drag.service';
import { DraggableDirective } from '../drag/draggable-directive';
import { DropTargetDirective } from '../drag/drop-target.directive';
import { isDevMode } from '@angular/core';
import { QuickViewCreateComponent } from './components/workspace/output-container/quick-view/quick-view-create/quick-view-create.component';
import { QuickViewSelectAllComponent } from './components/workspace/output-container/quick-view/quick-view-select-all/quick-view-select-all.component';
import { QuickViewSelectComponent } from './components/workspace/output-container/quick-view/quick-view-select/quick-view-select.component';
import { QuickViewUseComponent } from './components/workspace/output-container/quick-view/quick-view-use/quick-view-use.component';
import { SerializeHelper } from './backendCalls/serializationHelper';
import { QuickViewEditComponent } from './components/workspace/output-container/quick-view/quick-view-edit/quick-view-edit.component';
import { FindAllComponent } from './components/workspace/output-container/find-all/find-all.component';
import { ClipboardModule } from 'ngx-clipboard';
import { MessageComponentComponent } from './components/workspace/message/message-component/message-component.component';
import { MessageSubcomponentComponent } from './components/workspace/message/message-subcomponent/message-subcomponent.component';
import { MessageRepeatComponent } from './components/workspace/message/message-repeat/message-repeat.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { AddComponent } from './components/menu/add/add.component';
import { AddMessageComponent } from './components/menu/add-message/add-message.component';

enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WorkspaceComponent,
    MessageComponent,
    MessageSegmentComponent,
    MenuToolbarComponent,
    MenuItemComponent,
    OutputContainerComponent,
    OutputTabContainerComponent,
    ComparespaceComponent,
    QuickViewComponent,
    SearchComponent,
    StandardComponent,
    ComparespaceWorkspaceComponent,
    ComparespaceHighlightingComponent,
    ComparespaceFieldHighlightingComponent,
    DraggableDirective,
    DropTargetDirective,
    ComparespaceSegmentHighlightingComponent,
    QuickViewCreateComponent,
    QuickViewSelectAllComponent,
    QuickViewSelectComponent,
    QuickViewUseComponent,
    QuickViewEditComponent,
    FindAllComponent,
    MessageSegmentComponent,
    MessageComponentComponent,
    MessageSubcomponentComponent,
    MessageRepeatComponent,
    AddComponent,
    AddMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgReduxModule,
    ClipboardModule,
    ContextMenuModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [DragService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private ngRedux: NgRedux<{}>) {
    if (loadState(ngRedux) !== undefined) {
      ngRedux.provideStore(createStore(rootReducer, loadState(ngRedux)));
    } else {
      ngRedux.configureStore(rootReducer, {});
    }
    localStorage.clear();
  }

}

function rootReducer(state: IAppState, action: IAction): IAppState {
  return {
    currentMessage: reduceCurrentMessage(state.currentMessage, action),
    messages: reduceMessages(state.messages, action),
    menu: reduceMenu(state.menu, action),
    workspace: reduceWorkspace(state.workspace, action),
    accordion: reduceAccordion(state.accordion, action),
    searchConditions: reduceSearchCondition(state.searchConditions, action),
    searchConditionSize: reduceSearchConditionSize(state.searchConditionSize, action),
    searchFilter: reduceSearchResults(state.searchFilter, action),
    messagesToCompare: reduceMessagesToCompare(state.messagesToCompare, action),
    discrepancies: reduceDiscrepancies(state.discrepancies, action),
    jwt: reduceJWT(state.jwt, action),
    findAll: reduceFindAll(state.findAll, action),
    findAllUnique: reduceFindAllUnique(state.findAllUnique, action),
    messageHighlight: reduceMessageHighlight(state.messageHighlight, action)
  };
}

function loadState(redux) {
  let sHelper = new SerializeHelper(redux);
  return sHelper.read();
}
