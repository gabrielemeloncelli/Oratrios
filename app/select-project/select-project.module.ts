import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { ModalModule }                from '../ng2-bs3-modal/ng2-bs3-modal.module';
import { SelectProjectComponent }     from './select-project.component';
import { SelectProjectRoutingModule } from './select-project-routing.module';
import { CoreModule }                 from '../core/core.module';

@NgModule({
    imports: [
    BrowserModule,
    ModalModule,
    SelectProjectRoutingModule
  ],
  declarations: [ SelectProjectComponent ]
})
export class SelectProjectModule{}
