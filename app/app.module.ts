import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

/* App Root */
import { AppComponent }   from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
//import { routing }        from './app.routing';
import { TreeViewModule } from './lazy-loaded-tree-view/tree-view.module';
import { ModalModule } from './ng2-bs3-modal/ng2-bs3-modal.module';

import { NodeSelectorService } from './core/node-selector.service';
import { CoreEstService } from './core/core.est.service';//TODO : remove
import { PositionService } from './core/position.service';
import { UiStatusService } from './core/ui-status.service';



@NgModule({
  imports: [
    BrowserModule,

/*
    CoreModule,
*/
    //CoreModule.forRoot({"user": {login: "pippo", isAdministrator: false}}),
    //routing,
    CoreModule.forRoot({userLogin: 'pluto', userIsAdministrator: true}),
    TreeViewModule,
    ModalModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ NodeSelectorService, PositionService, UiStatusService ]
})
export class AppModule { }
