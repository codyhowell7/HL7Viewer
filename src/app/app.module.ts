import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { appRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MessageComponent } from './components/workspace/message/message.component';
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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { QuickViewCreateComponent } from './components/workspace/output-container/quick-view/quick-view-create/quick-view-create.component';
import { QuickViewSelectAllComponent } from './components/workspace/output-container/quick-view/quick-view-select-all/quick-view-select-all.component';
import { QuickViewSelectComponent } from './components/workspace/output-container/quick-view/quick-view-select/quick-view-select.component';
import { QuickViewUseComponent } from './components/workspace/output-container/quick-view/quick-view-use/quick-view-use.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WorkspaceComponent,
    MessageComponent,
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
    QuickViewUseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgReduxModule,
  ],
  providers: [DragService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private ngRedux: NgRedux<{}>) {
    ngRedux.configureStore(rootReducer, {});
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
    jwt: reduceJWT(state.jwt, action)
  };
}
