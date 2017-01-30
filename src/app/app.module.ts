import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { MenuComponent } from './components/menu/menu.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MessageComponent } from './components/workspace/message/message.component';
import { OutputComponent } from './components/workspace/output/output.component';
import { ToolbarComponent } from './components/workspace/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    MenuComponent,
    WorkspaceComponent,
    MessageComponent,
    OutputComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
