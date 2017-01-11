import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

/* App Root */
import { AppComponent }   from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';

import { TreeViewModule } from './lazy-loaded-tree-view/tree-view.module';
import { ModalModule } from './ng2-bs3-modal/ng2-bs3-modal.module';

import { NodeSelectorService } from './fill-bom/node-selector.service';
import { CoreEstService } from './fill-bom/core-est.service';//TODO : remove
import { UiStatusService } from './core/ui-status.service';
import { FillBomModule } from './fill-bom/fill-bom.module';
import { FillBomComponent } from './fill-bom/fill-bom.component';
import { AppRoutingModule }   from './app-routing.module';


@NgModule({
  imports: [
    BrowserModule,

/*
    CoreModule,
*/
    //CoreModule.forRoot({"user": {login: "pippo", isAdministrator: false}}),
    //routing,
    CoreModule.forRoot({userLogin: 'pluto', userIsAdministrator: true}),
    FillBomModule,
    TreeViewModule,
    ModalModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ NodeSelectorService, UiStatusService ]
})
export class AppModule { }
