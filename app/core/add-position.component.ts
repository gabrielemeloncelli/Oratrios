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
import { AttributeService } from './attribute.service';
import { Attribute } from './attribute';
import { PositionAttributeValue } from './position-attribute-value';

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
  public attributes: Attribute[];
  public attributeValues: string[];
  private _groups: CommodityGroup[];
  private _parts: CommodityPart[];


  @ViewChild(Select)
  private selectComponent: Select;


  constructor(public uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private _commodityPartService: CommodityPartService, private _commodityTableService: CommodityTableService,
     private _materialService: MaterialService, private _selectorService: NodeSelectorService,
     private _positionService: PositionService, private _attributeService: AttributeService)
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
    this._attributeService.attributes.subscribe(
      attributes => {this.attributes = attributes;
      console.log("add-position.component -- ngAfterViewInit -- attributes.length: " + attributes.length); //TODO: remove
    }
    );
    this._attributeService.getAll(1);
  }
  ngOnInit()
  {


    this._commodityGroupService.groups.subscribe(
      (groups: CommodityGroup[]) => {
        this.groups = groups.map(g => new SelectItem({id: g.id, text: g.code + " - " + g.description}));
        this._groups = groups;
      }
    );

    this._commodityPartService.parts.subscribe(
      (parts: CommodityPart[]) => {
        this.parts = parts.map(p => new SelectItem({id: p.id, text: p.code + " - " + p.description}));
        this._parts = parts;
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
    console.log("add-position.component -- groupSelected -- event.id: " + event.id);
    console.log("add-position.component -- groupSelected -- event.text: " + event.text);
    console.log("add-position.component -- groupSelected -- event.id === event.id + 0: " + (event.id === event.id + 0));
    var foundGroup: CommodityGroup = this.findSelectedGroup(event.id);
    this._selectedMaterial.groupCode = foundGroup.code;
    this.uiStatusService.commodityGroupCode = foundGroup.code;
    this._commodityPartService.getAll(event.id);//TODO:verify the returned type and property values of the event
  }

  findSelectedGroup(id: number): CommodityGroup{
    var result: CommodityGroup = null;
    var i: number;
    for(i = 0; i < this._groups.length; i += 1)
    {
      if(this._groups[i].id === i)
      {
        result = this._groups[i];
      }
    }
    return result;
  }

  partSelected(event: any)
  {
    var foundPart: CommodityPart = this.findSelectedPart(event.id);
    this._selectedMaterial.partId = event.id;
    this._selectedMaterial.partCode = foundPart.code;
    this.uiStatusService.partId = event.id;
    this.uiStatusService.commodityPartCode = foundPart.code;
    if (this._isTag)
    {
      this._tagAndQuantityVisible = true;
      console.log("add-position.component - partSelected - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

    }
    else
    {
      this._commodityTableService.getAll(this.uiStatusService.disciplineCode, this.uiStatusService.commodityGroupCode, event.text);
    }
  }

  findSelectedPart(id: number): CommodityPart{
    var result: CommodityPart = null;
    var i: number;
    for(i = 0; i < this._parts.length; i += 1)
    {
      if(this._parts[i].id === i)
      {
        result = this._parts[i];
      }
    }
    return result;
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
    this._materialService.getAll(this.uiStatusService.partId, filter);
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
      this.uiStatusService.partId = 0;
      this.uiStatusService.tablesAndSizesVisible = false;
      this._tableFilters = new Array<TableFilter>();
      this.resetPart();

  }

  resetPart()
  {
    this.changeGroup();
    this._commodityPartService.getAll(-1);
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
    this._selectedMaterial.partId = positionToEdit.partId;
    this._selectedMaterial.commodityCode = positionToEdit.commodityCode;
    this._selectedMaterial.description = positionToEdit.description;
    this._selectedMaterial.description2 = positionToEdit.description2;
    console.log("add-position.component - editPositionByObject - this._selectedMaterial.description2: " + this._selectedMaterial.description2);//TODO: remove
    if (!positionToEdit.isTwm) {
      setTimeout(() => this._materialService.getSingle(positionToEdit.materialId, positionToEdit.partId), 100);
    }
    console.log("add-position.component - editPositionByObject - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

  }


  resetMaterial()
  {
    this._selectedMaterial = new Material(0, "", "", 0, "", "", "");
    this.attributeValues = new Array<string>();
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
    var foundMaterial = new Material(0, "", "", 0, "", "", "");
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
    this.position.attributes = this.getAttributeValues();
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
  getAttributeValues(): PositionAttributeValue[]{
    var result = new Array<PositionAttributeValue>();
    var i: number;
    for(i = 0; i < this.attributeValues.keys.length; i += 1)
    {
      result.push(new PositionAttributeValue(this.attributeValues.keys[i], this.attributeValues[this.attributeValues.keys[i]]));
    }
    return result;
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
