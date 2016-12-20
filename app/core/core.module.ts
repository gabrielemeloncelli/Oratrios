/* tslint:disable:member-ordering no-unused-variable */
import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf }       from '@angular/core';

import { CommonModule }      from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreEstService } from './core.est.service';
import { SelectModule } from '../ng2-select/select.module'
import { SessionService } from './session.service';
import { SessionServiceConfig } from './session.service';
import { PositionsListComponent } from './positions-list.component';
import { ModalModule } from '../ng2-bs3-modal/ng2-bs3-modal.module';
import { AddPositionComponent } from './add-position.component';
import { CommodityGroupService } from './commodity-group.service';
import { CommodityGroupStoreService } from './commodity-group-store.service';
import { CommodityPartService } from './commodity-part.service';
import { CommodityPartStoreService } from './commodity-part-store.service';
import { MaterialStoreService } from './material-store.service';
import { MaterialService } from './material.service';
import { PositionService } from './position.service';
import { PositionStoreService } from './position-store.service';
import { CommodityTable } from './commodity-table';
import { CommodityTableService } from './commodity-table.service';
import { CommodityTableStoreService } from './commodity-table-store.service';
import { CommodityTableValue } from './commodity-table-value';
import { CommodityTableValueService } from './commodity-table-value.service';
import { CommodityTableValueStoreService } from './commodity-table-value-store.service';
import { AttributeStoreService } from './attribute-store.service';
import { AttributeService } from './attribute.service';


@NgModule({
  imports:      [ CommonModule, FormsModule, SelectModule, ModalModule ],
  declarations: [ PositionsListComponent, AddPositionComponent ],
  exports:      [ CommonModule, FormsModule, SelectModule, PositionsListComponent, AddPositionComponent, ModalModule ],
  providers:    [ CoreEstService, CommodityGroupService, CommodityGroupStoreService, CommodityPartService, CommodityPartStoreService,
  MaterialStoreService, MaterialService, PositionService, PositionStoreService, CommodityTableService, CommodityTableStoreService,
  CommodityTableValueService, CommodityTableValueStoreService, AttributeStoreService, AttributeService ]
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
