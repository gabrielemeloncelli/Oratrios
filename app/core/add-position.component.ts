import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStatusService } from './ui-status.service';
import { ModalComponent } from '../ng2-bs3-modal/components/modal';
import { CommodityGroup } from './commodity-group';
import { CommodityGroupService } from './commodity-group.service';
import { CommodityPart } from './commodity-part';
import { CommodityPartService } from './commodity-part.service';
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
  tables: any[] = [{name: "Table 1", items:["T1 Value 1", "T1 Value 2","T1 Value 3", "T1 Value 4"]},
   {name: "Table 2", items:["T2 Value 1", "T2 Value 2","T2 Value 3", "T2 Value 4", "T2 Value 5", "T2 Value 6"]},
   {name: "Table 3", items:["T3 Value 1", "T3 Value 2","T3 Value 3", "T3 Value 4", "T3 Value 5", "T3 Value 6", "T3 Value 7"]}];

  constructor(private _uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService, private _commodityPartService: CommodityPartService)
  {
    this.groups.push(new SelectItem({id: '0', text: ''}));
    this.parts.push(new SelectItem({id: '0', text: ''}));
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
        //console.log('add-position.component - ngOnInit - parts.lenght' + parts.length);
        this.parts = parts.map(p => new SelectItem({id: p.code, text: p.description}))
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
    this._commodityPartService.getAll(event.id);
  }
}
