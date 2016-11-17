import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStatusService } from './ui-status.service';
import { ModalComponent } from '../ng2-bs3-modal/components/modal';
import { CommodityGroup } from './commodity-group';
import { CommodityGroupService } from './commodity-group.service';
import { CommodityPart } from './commodity-part';
import { CommodityPartService } from './commodity-part.service';
import { MappedTable } from './mapped-table';
import { RuleTableService } from './rule-table.service';
import { SelectItem } from '../ng2-select/select/select-item';

@Component({
selector: "addposition",
templateUrl: "/app/core/add-position.component.html",
styleUrls: ["/app/core/add-position.component.css"  ]

})
export class AddPositionComponent
{

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;
  public groups: SelectItem[] = new Array<SelectItem>();
  public groupsDisabled: boolean = false;
  public groupBg: any = {"text": "Area", "id": "Area"};
  public parts: SelectItem[] = new Array<SelectItem>();
  tables = new Array<MappedTable>();


  constructor(private _uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private _commodityPartService: CommodityPartService, private _ruleTableService: RuleTableService)
  {

  }

  ngOnInit()
  {
    this._uiStatusService.insertPosition.subscribe(
      detail => {
        if (detail.displayInsertPosition)
        {
          this.modalComponent.open('lg');
        }
      }
    );

    this._commodityGroupService.groups.subscribe(
      (groups: CommodityGroup[]) => this.groups = groups.map(g => new SelectItem({id: g.code, text: g.description}))
    );

    this._commodityPartService.parts.subscribe(
      (parts: CommodityPart[]) => {
        this.parts = parts.map(p => new SelectItem({id: p.code, text: p.description}))
      }
    );

    this._ruleTableService.tables.subscribe(
      (tables: MappedTable[]) => {
        this.tables = tables;
      }
    );


  }

  refreshValue(event: any)
  {

  }
  removed(event: any){}

  typed(event: any){}

  groupSelected(event: any)
  {
    this._uiStatusService.commodityGroupCode = event.id;
    this._commodityPartService.getAll(event.id);
  }

  partSelected(event: any)
  {
    this._uiStatusService.commodityPartCode = event.id;
    this._ruleTableService.getAll(this._uiStatusService.commodityGroupCode, event.id);
  }
}
