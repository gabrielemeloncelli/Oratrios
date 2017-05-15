/* tslint:disable:member-ordering no-unused-variable */
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf }              from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { BsDropdownModule,
          TooltipModule } from 'ng2-bootstrap';
import { SelectModule }   from 'angular2-select';

import { SessionService }                 from './session.service';
import { ModalModule }                    from '../ng2-bs3-modal/ng2-bs3-modal.module';
import { ProjectDisciplineService }       from './project-discipline.service';
import { ProjectDisciplineStoreService }  from './project-discipline-store.service';
import { NodeTypeService }                from './node-type.service';


@NgModule({
  imports:      [ CommonModule, FormsModule, SelectModule, ModalModule,
    BsDropdownModule.forRoot(), TooltipModule.forRoot() ],
  exports:      [ CommonModule, FormsModule, SelectModule, ModalModule, BsDropdownModule, TooltipModule ],
  providers:    [ ProjectDisciplineService, ProjectDisciplineStoreService, NodeTypeService, SessionService ]
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }


}
