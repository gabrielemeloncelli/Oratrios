import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

/* App Root */
import { AppComponent }   from './app.component';

/* Feature Modules */
import { CoreModule }             from './core/core.module';
import { TreeViewModule }         from './lazy-loaded-tree-view/tree-view.module';
import { ModalModule }            from './ng2-bs3-modal/ng2-bs3-modal.module';
import { NodeSelectorService }    from './fill-bom/node-selector.service';
import { CoreEstService }         from './fill-bom/core-est.service';//TODO : remove
import { UiStatusService }        from './core/ui-status.service';
import { FillBomModule }          from './fill-bom/fill-bom.module';
import { SelectProjectModule }    from './select-project/select-project.module';
import { ExportModule }           from './export/export.module';
import { AppRoutingModule }       from './app-routing.module';
import { DisciplineSelectModule } from './discipline-select/discipline-select.module';


@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    FillBomModule,
    TreeViewModule,
    ModalModule,
    AppRoutingModule,
    SelectProjectModule,
    ExportModule,
    DisciplineSelectModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ NodeSelectorService, UiStatusService ]
})
export class AppModule { }
