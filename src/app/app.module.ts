import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { RouterModule } from '@angular/router';

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
import {
  reduceCurrentMessage, reduceMessages, reduceMenu, reduceWorkspace, reduceAccordion,
  reduceFieldOffset, reduceFieldAccordion, reduceSegmentOffset, reduceComponentOffset,
  reduceComponentAccordion
} from './reducers/reducers';
import { ComparespaceComponent } from './components/comparespace/comparespace.component';
import { QuickViewComponent } from './components/workspace/output-container/quick-view/quick-view.component';
import { SearchComponent } from './components/workspace/output-container/search/search.component';
import { StandardComponent } from './components/workspace/output-container/standard/standard.component';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgReduxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(ngRedux: NgRedux<{}>) {
    ngRedux.configureStore(rootReducer, {});
  }

}

function rootReducer(state: IAppState, action: IAction): IAppState {
  return {
    currentMessage: reduceCurrentMessage(state.currentMessage, action),
    messages: reduceMessages(state.messages, action),
    menu: reduceMenu(state.menu, action),
    workspace: reduceWorkspace(state.workspace, action),
    segmentOffset: reduceSegmentOffset(state.segmentOffset, action),
    fieldOffset: reduceFieldOffset(state.fieldOffset, action),
    componentOffset: reduceComponentOffset(state.componentOffset, action),
    accordion: reduceAccordion(state.accordion, action),
    fieldAccordion: reduceFieldAccordion(state.fieldAccordion, action),
    componentAccordion: reduceComponentAccordion(state.componentAccordion, action)
  };
}
