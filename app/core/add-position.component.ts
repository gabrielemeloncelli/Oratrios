import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UiStatusService } from './ui-status.service';
import { ModalComponent } from '../ng2-bs3-modal/components/modal';
import { CommodityGroup } from './commodity-group';
import { CommodityGroupService } from './commodity-group.service';
import { CommodityPart } from './commodity-part';
import { CommodityPartService } from './commodity-part.service';
import { MappedTable } from './mapped-table';
import { RuleTableService } from './rule-table.service';
import { SelectItem } from '../ng2-select/select/select-item';
import { Material } from './material';
import { MaterialService } from './material.service';
import { TableAndSizeFilter } from './table-and-size-filter';
import { TableFilter } from './table-filter';
import { Position } from './position';
import { Select } from '../ng2-select/select/select';

@Component({

selector: "addposition",
templateUrl: "app/core/add-position.component.html",
styleUrls: ["app/core/add-position.component.css"  ]

})
export class AddPositionComponent
{

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;
  public groups: SelectItem[] = new Array<SelectItem>();
  public groupsDisabled: boolean = false;
  public groupBg: any = {"text": "Area", "id": "Area"};
  public parts: SelectItem[] = new Array<SelectItem>();
  public materials: Material[] = new Array<Material>();
  tables = new Array<MappedTable>();
  public size1: string;
  public size2: string;
  public size3: string;
  public size4: string;
  public size5: string;
  private _tableFilters = new Array<TableFilter>();
  public position: Position = new Position();
  private _selectedMaterial: Material = null;
  private _selectedMaterialVisible = false;
  private _tagAndQuantityVisible = false;
  private _isTag = false;

  @ViewChild(Select)
  private selectComponent: Select;


  constructor(public uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private _commodityPartService: CommodityPartService, private _ruleTableService: RuleTableService,
     private _materialService: MaterialService)
  {
    this.resetMaterial();
  }

  ngAfterViewInit()
  {
    this.uiStatusService.insertPosition.subscribe(
      detail => {
        if (detail.displayInsertPosition)
        {
          this._isTag = detail.positionFromTag;
          this.modalComponent.open('lg');
          console.log('add-position.component - ngAfterContentInit - this.selectComponent: ' + this.selectComponent)
          this.resetPosition();
        }
      }
    );
  }
  ngOnInit()
  {


    this._commodityGroupService.groups.subscribe(
      (groups: CommodityGroup[]) => this.groups = groups.map(g => new SelectItem({id: g.code, text: g.description}))
    );

    this._commodityPartService.parts.subscribe(
      (parts: CommodityPart[]) => {
        this.parts = parts.map(p => new SelectItem({id: p.code, text: p.description}));
        this.changeGroup();
      }
    );

    this._ruleTableService.tables.subscribe(
      (tables: MappedTable[]) => {
        this.tables = tables;
      }
    );

    this._materialService.materials.subscribe(
      (materials: Material[]) => {
        this.materials = materials;
      }
    )


  }

  refreshValue(event: any)
  {

  }
  removed(event: any){}

  typed(event: any){}

  groupSelected(event: any)
  {
    this.uiStatusService.commodityGroupCode = event.id;
    this._commodityPartService.getAll(event.id);
  }

  partSelected(event: any)
  {
    this.uiStatusService.commodityPartCode = event.id;
    if (this._isTag)
    {
      this._tagAndQuantityVisible = true;
    }
    else
    {
      this.uiStatusService.tablesAndSizesVisible = true;
      this._ruleTableService.getAll(this.uiStatusService.commodityGroupCode, event.id);
    }
  }

  tableSelected(event: any, tableName: string)
  {
    var foundFilter: TableFilter = null;
    for(var tableIndex = 0; tableIndex < this._tableFilters.length; tableIndex += 1)
    {
      if(this._tableFilters[tableIndex].tableName === tableName)
      {
        foundFilter = this._tableFilters[tableIndex];
      }
    }
    if (!foundFilter)
    {
      foundFilter = new TableFilter(tableName, event.id);
      this._tableFilters.push(foundFilter);
    }
    else
    {
      foundFilter.detail = event.id;
    }
  }

  findMaterial()
  {
    this.uiStatusService.materialsVisible = true;
    var tableFilters: TableFilter[] = new Array<TableFilter>();
    for(var tableIndex = 0; tableIndex < this._tableFilters.length; tableIndex += 1)
    {
      tableFilters.push(new TableFilter(this._tableFilters[tableIndex].tableName, this._tableFilters[tableIndex].detail));
    }
    var filter: TableAndSizeFilter = new TableAndSizeFilter(this.size1, this.size2, this.size3, this.size4, this.size5, tableFilters);
    this._materialService.getAll(this.uiStatusService.commodityGroupCode, this.uiStatusService.commodityPartCode, filter);
  }

  tableRemoved(tableName: string)
  {
    var foundFilterPosition = this.findFilterPosition(tableName);
    if (foundFilterPosition > -1)
    {
      this._tableFilters.splice(foundFilterPosition, 1);
    }
  }

  findFilterPosition(tableName: string): number
  {
    var foundIndex = -1;
    for (var loopIndex = 0; loopIndex < this._tableFilters.length; loopIndex += 1)
    {
      if (this._tableFilters[loopIndex].tableName === tableName)
      {
        foundIndex = loopIndex;
      }
    }
    return foundIndex;
  }

  onSubmit()
  {
    console.log('Form submitted');//TODO: remove
  }

  resetTest()
  {

  }
  resetPosition()
  {
    this.resetGroupAndPart();
  }

  resetGroupAndPart()
  {

      this.selectComponent.remove(null);
      this.uiStatusService.commodityGroupCode = "";
      this.uiStatusService.commodityPartCode = "";
      this.uiStatusService.tablesAndSizesVisible = false;
      this.resetPart();

  }

  resetPart()
  {
    this.changeGroup();
    this._commodityPartService.getAll("@#");
  }

  changeGroup()
  {
    this._selectedMaterialVisible = false;
    this._tagAndQuantityVisible = false;
    this.materials = new Array<Material>();
    this.uiStatusService.materialsVisible = false;
    this.uiStatusService.tablesAndSizesVisible = false;
    this.resetSizes();
    this.resetPositionModel();
    this.resetMaterial();
  }

  resetSizes()
  {
    this.size1 = null;
    this.size2 = null;
    this.size3 = null;
    this.size4 = null;
    this.size5 = null;
  }

  resetMaterial()
  {
    this._selectedMaterial = new Material(0, "", "", "", "", "", "");
  }

  resetPositionModel()
  {
    this.position = new Position();
  }

  selectMaterial(materialId: number)
  {
    this._selectedMaterial = this.selectMaterialFromCache(materialId);
    this._selectedMaterialVisible = true;
    this._tagAndQuantityVisible = true;
  }

  selectMaterialFromCache(materialId: number)
  {
    var foundMaterial = new Material(0, "", "", "", "", "", "");
    for(var materialIndex = 0; materialIndex < this.materials.length; materialIndex += 1)
    {
      if (this.materials[materialIndex].id === materialId)
      {
        foundMaterial = this.materials[materialIndex];
      }
    }
    return foundMaterial;
  }

}
