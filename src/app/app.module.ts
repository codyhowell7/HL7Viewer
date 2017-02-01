import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgReduxModule, NgRedux } from 'ng2-redux';

import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { MenuComponent } from './components/menu/menu.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MessageComponent } from './components/workspace/workspace-container/message/message.component';
import { OutputComponent } from './components/workspace/workspace-container/output-container/output/output.component';
import { WorkspaceContainerComponent } from './components/workspace/workspace-container/workspace-container.component';
import { MenuToolbarComponent } from './components/menu/menu-toolbar/menu-toolbar.component';
import { MenuToolbarOptionComponent } from './components/menu/menu-toolbar/menu-toolbar-option/menu-toolbar-option.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { OutputContainerComponent } from './components/workspace/workspace-container/output-container/output-container.component';
import { OutputTabComponent } from './components/workspace/workspace-container/output-container/output-tab-container/output-tab/output-tab.component';
import { OutputTabContainerComponent } from './components/workspace/workspace-container/output-container/output-tab-container/output-tab-container.component';

import { IAppState } from './states/states';
import { WorkspaceMode } from './enums/enums';
import { IAction } from './actions/actions';
import { reduceMenu, reduceWorkspace } from './reducers/reducers';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    MenuComponent,
    WorkspaceComponent,
    MessageComponent,
    OutputComponent,
    WorkspaceContainerComponent,
    MenuToolbarComponent,
    MenuToolbarOptionComponent,
    MenuItemComponent,
    OutputContainerComponent,
    OutputTabComponent,
    OutputTabContainerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    NgReduxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(ngRedux: NgRedux<{}>){
    ngRedux.configureStore(rootReducer, {});
  }

}

function rootReducer(state: IAppState, action: IAction): IAppState {
  return {
      menu: reduceMenu(state.menu, action),
      workspace: reduceWorkspace(state.workspace, action)
    };
}