import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UiStatusService } from './ui-status.service';
import { ModalComponent } from '../ng2-bs3-modal/components/modal';
import { CommodityGroup } from './commodity-group';
import { CommodityGroupService } from './commodity-group.service';
import { CommodityPart } from './commodity-part';
import { CommodityPartService } from './commodity-part.service';
import { MappedTable } from './mapped-table';
import { CommodityTableService } from './commodity-table.service';
import { SelectItem } from '../ng2-select/select/select-item';
import { Material } from './material';
import { MaterialService } from './material.service';
import { TableAndSizeFilter } from './table-and-size-filter';
import { TableFilter } from './table-filter';
import { BomPosition } from './bom-position';
import { Select } from '../ng2-select/select/select';
import { NodeSelectorService } from './node-selector.service';
import { PositionService } from './position.service';
import { CommodityTable } from  './commodity-table';

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
  private _tableFilters = new Array<TableFilter>();
  public position: BomPosition = new BomPosition();
  private _selectedMaterial: Material = null;
  private _selectedMaterialVisible = false;
  private _tagAndQuantityVisible = false;
  private _isTag = false;
  private _description2Keypress = false;
  private _isEdit = false;


  @ViewChild(Select)
  private selectComponent: Select;


  constructor(public uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private _commodityPartService: CommodityPartService, private _commodityTableService: CommodityTableService,
     private _materialService: MaterialService, private _selectorService: NodeSelectorService,
     private _positionService: PositionService)
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
          this.resetPosition();
          setTimeout(() => this.modalComponent.open('lg'), 200);
        }
      }
    );
    this.uiStatusService.editPositionObservable.subscribe(
      position => {
        console.log("ahflashdflas - position == null: " + (position == null))
        if (position)
        {
          this._isTag = position.isTwm;
          this.editPositionByObject(position);
          setTimeout(() => this.modalComponent.open('lg'), 200);
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

    this._commodityTableService.tables.subscribe(
      (tables: CommodityTable[]) => {
        setTimeout(() => this.uiStatusService.tablesAndSizesVisible = (this._selectedMaterial.partCode != ""), 100);
        this.tables = tables.map(t => new MappedTable(t));

      }
    );

    this._materialService.materials.subscribe(
      (materials: Material[]) => {
        this.materials = materials;
        if (this._isEdit && this.materials.length > 0)
        {
          this._selectedMaterial = this.materials[0];
          console.log("add-position.component - ngOnInit");//TODO: remove
        }
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
    this._selectedMaterial.groupCode = event.id;
    this.uiStatusService.commodityGroupCode = event.id;
    this._commodityPartService.getAll(this.uiStatusService.disciplineCode, event.id);
  }

  partSelected(event: any)
  {
    this._selectedMaterial.partCode = event.id;
    this.uiStatusService.commodityPartCode = event.id;
    if (this._isTag)
    {
      this._tagAndQuantityVisible = true;
      console.log("add-position.component - partSelected - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

    }
    else
    {
      this._commodityTableService.getAll(this.uiStatusService.disciplineCode, this.uiStatusService.commodityGroupCode, event.id);
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
    var filter: TableAndSizeFilter = new TableAndSizeFilter(tableFilters);
    this._materialService.getAll(this.uiStatusService.disciplineCode, this.uiStatusService.commodityGroupCode, this.uiStatusService.commodityPartCode, filter);
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
    this._isEdit = false;
    this.resetGroupAndPart();
  }

  resetGroupAndPart()
  {

      this.selectComponent.remove(null);
      this.uiStatusService.commodityGroupCode = "";
      this.uiStatusService.commodityPartCode = "";
      this.uiStatusService.tablesAndSizesVisible = false;
      this._tableFilters = new Array<TableFilter>();
      this.resetPart();

  }

  resetPart()
  {
    this.changeGroup();
    this._commodityPartService.getAll(this.uiStatusService.disciplineCode, "@#");
  }

  changeGroup()
  {
    this._selectedMaterialVisible = false || this._isEdit;
    this._tagAndQuantityVisible = false || this._isEdit;
    console.log("add-position.component - changeGroup - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove
    console.log("add-position.component - changeGroup - this._isEdit: " + this._isEdit);//TODO: remove
    this.materials = new Array<Material>();
    this.uiStatusService.materialsVisible = false;
    this.uiStatusService.tablesAndSizesVisible = false;
    if (!this._isEdit)
    {
      this.resetPositionModel();
      this.resetMaterialDetails();
    }

  }


  editPositionByObject(positionToEdit: BomPosition)
  {
    this.resetPosition();
    this._tagAndQuantityVisible = true;
    this._isEdit = true;
    this._isTag = positionToEdit.isTwm;
    this.position = positionToEdit;
    this._selectedMaterial.id = positionToEdit.materialId;
    this._selectedMaterial.groupCode = positionToEdit.groupCode;
    this._selectedMaterial.partCode = positionToEdit.partCode;
    this._selectedMaterial.commodityCode = positionToEdit.commodityCode;
    this._selectedMaterial.description = positionToEdit.description;
    this._selectedMaterial.description2 = positionToEdit.description2;
    console.log("add-position.component - editPositionByObject - this._selectedMaterial.description2: " + this._selectedMaterial.description2);//TODO: remove
    if (!positionToEdit.isTwm) {
      setTimeout(() => this._materialService.getSingle(positionToEdit.materialId), 100);
    }
    console.log("add-position.component - editPositionByObject - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

  }


  resetMaterial()
  {
    this._selectedMaterial = new Material(0, "", "", "", "", "");
    this.resetMaterialDetails();
  }

  resetMaterialDetails()
  {
    this._selectedMaterial.partCode = "";
    this._selectedMaterial.commodityCode = "";
    this._selectedMaterial.description = "";
    this._selectedMaterial.description2 = "";
    this._description2Keypress = false;
  }

  resetPositionModel()
  {
    console.log("add-position.component - resetPositionModel");//TODO:remove
    this.position = new BomPosition();
    this.position.nodeId = this._selectorService.lastSelectedNode.id;
  }

  selectMaterial(materialId: number)
  {
    this._selectedMaterial = this.selectMaterialFromCache(materialId);
    this._selectedMaterialVisible = true;
    this._tagAndQuantityVisible = true;
    console.log("add-position.component - selectMaterial - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

  }

  selectMaterialFromCache(materialId: number)
  {
    var foundMaterial = new Material(0, "", "", "", "", "");
    for(var materialIndex = 0; materialIndex < this.materials.length; materialIndex += 1)
    {
      if (this.materials[materialIndex].id === materialId)
      {
        foundMaterial = this.materials[materialIndex];
      }
    }
    return foundMaterial;
  }

  savePosition()
  {
    this.position.materialId = this._selectedMaterial.id;
    this.position.groupCode = this._selectedMaterial.groupCode;
    this.position.partCode = this._selectedMaterial.partCode;
    this.position.commodityCode = this._selectedMaterial.commodityCode;
    this.position.description = this._selectedMaterial.description;
    this.position.description2 = this._selectedMaterial.description2;
    this.position.isTwm = this._isTag;
    if (this._isEdit){
      this._positionService.editPosition(this.position).subscribe(
        p => {
          this._selectorService.refreshNode();
        }
      );
    }
    else
    {
      this._positionService.addPosition(this.position).subscribe(
        p => {
          this._selectorService.refreshNode();
        }
      );
    }

  }

  description2KeyPress()
  {
    this._description2Keypress = true;
  }

  descriptionChanged()
  {
    if(!this._description2Keypress)
    {
      this._selectedMaterial.description2 = this._selectedMaterial.description;
    }
  }

  savePositionLabel(): string
  {
    return this._isEdit ? "Edit" : "Add";
  }

}
