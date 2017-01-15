/* tslint:disable:member-ordering no-unused-variable */
import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf }       from '@angular/core';

import { CommonModule }      from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '../ng2-select/select.module'
import { SessionService } from './session.service';
import { SessionServiceConfig } from './session.service';
import { ModalModule } from '../ng2-bs3-modal/ng2-bs3-modal.module';



@NgModule({
  imports:      [ CommonModule, FormsModule, SelectModule, ModalModule ],
  exports:      [ CommonModule, FormsModule, SelectModule, ModalModule ],
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: SessionServiceConfig): ModuleWithProviders {
    var sessionService: SessionService = new SessionService(config);
    return {
      ngModule: CoreModule,
      providers: [  {provide: SessionService, useFactory: CoreModule.sessionServiceFactory(config), deps: [] } ]
    };
  }

  static sessionServiceFactory(config: SessionServiceConfig)
  {
    return (): SessionService =>     {
      return new SessionService(config);
    }
  }
}
