import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UiStatusService } from '../core/ui-status.service';
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
import { PositionInput } from './position-input';

@Component({

selector: "addposition",
templateUrl: "app/fill-bom/add-position.component.html",
styleUrls: ["app/fill-bom/add-position.component.css"  ]

})
export class AddPositionComponent
{

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;
  public groups: SelectItem[] = new Array<SelectItem>();
  public groupsDisabled: boolean = false;
  public parts: SelectItem[] = new Array<SelectItem>();
  public materials: Material[] = new Array<Material>();
  public addedPositions: PositionInput[] = new Array<PositionInput>();
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
  public errorMessage: string;
  public tagError: boolean;
  private _savedCount: number;
  private _saveFailedCount: number;


  @ViewChild(Select)
  private selectComponent: Select;


  constructor(public uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private _commodityPartService: CommodityPartService, private _commodityTableService: CommodityTableService,
     private _materialService: MaterialService, private _selectorService: NodeSelectorService,
     private _positionService: PositionService, private _attributeService: AttributeService)
  {

    this.resetMaterial();
    this.resetAddedPositions();

  }

  ngAfterViewInit()
  {
    this.uiStatusService.insertPosition.subscribe(
      detail => {
        console.log("insertPositionCallback - detail == null: " + (detail == null))
        if (detail.displayInsertPosition)
        {
          this._isTag = detail.positionFromTag;
          this.resetPosition();
          setTimeout(() => this.modalComponent.open('fs'), 200);
        }
      }
    );
    this.uiStatusService.editPositionObservable.subscribe(
      position => {
        console.log("editPositionCallback - position == null: " + (position == null))
        if (position)
        {
          this._isTag = position.isTwm;
          this.editPositionByObject(position);
          setTimeout(() => this.modalComponent.open('fs'), 200);
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
        console.log("add-position.component -- ngOnInit -- this._selectedMaterial.partCode: " + this._selectedMaterial.partCode);//TODO:remove
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


  removed(event: any){}

  typed(event: any){}

  groupSelected(event: any)
  {
    console.log("add-position.component -- groupSelected -- event.id: " + event.id);
    console.log("add-position.component -- groupSelected -- event.text: " + event.text);
    console.log("add-position.component -- groupSelected -- event.id === event.id + 0: " + (event.id === event.id + 0));
    console.log("add-position.component -- groupSelected -- getting group");
    var foundGroup: CommodityGroup = this.findSelectedGroup(event.id);
    console.log("add-position.component -- groupSelected -- group recovered");
    this._selectedMaterial.groupCode = foundGroup.code;
    this.uiStatusService.commodityGroupCode = foundGroup.code;
    this._commodityPartService.getAll(event.id);//TODO:verify the returned type and property values of the event
  }

  findSelectedGroup(id: number): CommodityGroup{
    var result: CommodityGroup = null;
    var i: number;
    console.log("add-position.component -- findSelectedGroup -- id: " + id);//TODO:remove
    console.log("add-position.component -- findSelectedGroup -- this._groups.length: " + this._groups.length);//TODO:remove
    for(i = 0; i < this._groups.length; i += 1)
    {
      console.log("add-position.component -- findSelectedGroup -- this._groups[i].id: " + this._groups[i].id);//TODO:remove
      if(this._groups[i].id === id)
      {
        console.log("add-position.component -- findSelectedGroup -- group assigned id: " + this._groups[i].id);//TODO:remove
        result = this._groups[i];
      }
    }
    return result;
  }

  partSelected(event: any)
  {
    var foundPart: CommodityPart = this.findSelectedPart(event.id);
    this.resetMaterial();
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
      this._commodityTableService.getAll(this.uiStatusService.disciplineCode, this.uiStatusService.commodityGroupCode, foundPart.code);
    }

  }

  findSelectedPart(id: number): CommodityPart{
    var result: CommodityPart = null;
    var i: number;
    console.log("add-position.component -- findSelectedPart -- id: " + id);//TODO:remove
    console.log("add-position.component -- findSelectedPart -- this._parts.length: " + this._parts.length);//TODO:remove
    for(i = 0; i < this._parts.length; i += 1)
    {
      console.log("add-position.component -- findSelectedPart -- this._parts[i].id: " + this._parts[i].id);//TODO:remove
      if(this._parts[i].id === id)
      {
        console.log("add-position.component -- findSelectedPart -- part assigned id: " + this._parts[i].id);//TODO:remove
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
    this.resetAddedPositions();
    this.resetGroupAndPart();
  }

  resetAddedPositions()
  {
    this.addedPositions = new Array<PositionInput>();
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
    this._selectedMaterial.unit = positionToEdit.unit;
    this.setAttributes(positionToEdit.attributes);
    if (!positionToEdit.isTwm) {
      setTimeout(() => this._materialService.getSingle(positionToEdit.materialId, positionToEdit.partId), 100);
    }


  }

  setAttributes(attributes: PositionAttributeValue[])
  {
    var identifier: number;
    if (attributes != null)
    {
      var index: number;
      for(index = 0; index < attributes.length; index += 1)
      {
        this.attributeValues[attributes[index].attribute.id] = attributes[index].value;
      }
    }
  }


  resetMaterial()
  {
    this._selectedMaterial = new Material(0, "", "", 0, "", "", "", "");
    this.resetMaterialDetails();
  }

  resetMaterialDetails()
  {
    this._selectedMaterial.partCode = "";
    this._selectedMaterial.commodityCode = "";
    this._selectedMaterial.description = "";
    this._selectedMaterial.description2 = "";
    this._description2Keypress = false;
    this._selectedMaterial.unit = "";
    this.attributeValues = new Array<string>();
    this.errorMessage = "";
    this.tagError = false;
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

    var newPosition: BomPosition = new BomPosition();
    newPosition.id = 0;
    newPosition.materialId = this._selectedMaterial.id;
    newPosition.groupCode = this._selectedMaterial.groupCode;
    newPosition.partCode = this._selectedMaterial.partCode;
    newPosition.partId = this._selectedMaterial.partId;
    newPosition.commodityCode = this._selectedMaterial.commodityCode;
    newPosition.description = this._selectedMaterial.description;
    newPosition.description2 = this._selectedMaterial.description2;
    newPosition.unit = this._selectedMaterial.unit;
    newPosition.nodeId = this.position.nodeId;
    newPosition.attributes = new Array<PositionAttributeValue>();

    this.addedPositions.push(new PositionInput(newPosition, new Array<string>()));
    console.log("add-position.component - selectMaterial - this._tagAndQuantityVisible: " + this._tagAndQuantityVisible);//TODO: remove

  }

  selectMaterialFromCache(materialId: number)
  {
    var foundMaterial = new Material(0, "", "", 0, "", "", "", "");
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
    this.errorMessage = "";
    this._savedCount = 0;
    this._saveFailedCount = 0;
    console.log("add-position.component -- savePosition -- this._isEdit: " + this._isEdit); //TODO: remove
    console.log("add-position.component -- savePosition -- this._isTag: " + this._isTag); //TODO: remove
    if (this._isEdit || this._isTag)
    {
      console.log("add-position.component -- savePosition -- invoking saveSinglePosition"); //TODO: remove
      this.saveSinglePosition();
    }
    else
    {
      console.log("add-position.component -- savePosition -- invoking savePositionList"); //TODO: remove
      this.savePositionList();
    }
  }

  saveSinglePosition()
  {
    var newPosition: BomPosition = new BomPosition();
    newPosition.id = 0;
    newPosition.materialId = this._selectedMaterial.id;
    newPosition.groupCode = this._selectedMaterial.groupCode;
    newPosition.partCode = this._selectedMaterial.partCode;
    newPosition.partId = this._selectedMaterial.partId;
    newPosition.commodityCode = this._selectedMaterial.commodityCode;
    newPosition.description = this._selectedMaterial.description;
    newPosition.description2 = this._selectedMaterial.description2;
    newPosition.unit = this._selectedMaterial.unit;
    console.log('add-position-component - saveSinglePosition - this._selectedMaterial.unit: ' + this._selectedMaterial.unit);//TODO remove
    newPosition.isTwm = this._isTag;
    newPosition.nodeId = this.position.nodeId;

    newPosition.tag = this.position.tag;
    newPosition.quantity = this.position.quantity;

    newPosition.attributes = this.getAttributeValues();
    if (this._isEdit){
      this._positionService.editPosition(newPosition).subscribe(
        p => {
          this._selectorService.refreshNode();
        }
      );
    }
    else
    {
      this._positionService.addPosition(newPosition)
        .subscribe(
        p => {
          this._selectorService.refreshNode();
          this.modalComponent.dismiss();
        },
        e => 
        {
          this.errorMessage = e.message;
          if (this.errorMessage === "Duplicated Tag")
          {
            this.tagError = true;
          }
        }
      )
      ;
    }

  }

  savePositionList()
  {
    var addedBomPositions = new Array<BomPosition>();
    var i: number;
    for (i = 0; i < this.addedPositions.length; i += 1)
    {
      this.savePositionInArray(i);
    }
    

  }

  savePositionInArray(index: number)
  {
    var newPosition: BomPosition = new BomPosition();
    newPosition.id = 0;
    newPosition.materialId = this.addedPositions[index].bomPosition.materialId;
    newPosition.groupCode = this.addedPositions[index].bomPosition.groupCode;
    newPosition.partCode = this.addedPositions[index].bomPosition.partCode;
    newPosition.partId = this.addedPositions[index].bomPosition.partId;
    newPosition.commodityCode = this.addedPositions[index].bomPosition.commodityCode;
    newPosition.description = this.addedPositions[index].bomPosition.description;
    newPosition.description2 = this.addedPositions[index].bomPosition.description2;
    newPosition.unit = this.addedPositions[index].bomPosition.unit;
    console.log('savePositionInArray - saveSinglePosition - this.addedPositions[index].bomPosition.unit: ' + this.addedPositions[index].bomPosition.unit);//TODO remove
    newPosition.isTwm = false;
    newPosition.nodeId = this.addedPositions[index].bomPosition.nodeId;

    newPosition.tag = this.addedPositions[index].bomPosition.tag;
    newPosition.quantity = this.addedPositions[index].bomPosition.quantity;

    newPosition.attributes = this.fetchAttributesFromArray(this.addedPositions[index].attributes);
    
    this._positionService.addPosition(newPosition)
      .subscribe(
        p => {
          this.addedPositions[index].saved = true;
          this._savedCount += 1;
          this.checkAllPositionSaved();
        },
        e => 
        {
          this.addedPositions[index].saveFailed = true;
          this._saveFailedCount += 1;
          if (this.errorMessage && this.errorMessage.length > 0)
          {
            this.errorMessage += " - ";
          }
          this.errorMessage += e.message;
          if (e.message === "Duplicated Tag")
          {
            this.addedPositions[index].tagError = true;
          }
        }
      );
    
    
  }

  checkAllPositionSaved(): void
  {
    if (this._savedCount === this.addedPositions.length)
    {
      this._selectorService.refreshNode();
      this.modalComponent.dismiss();
      return;
    }
    if (this._savedCount + this._saveFailedCount === this.addedPositions.length)
    {
      this.purgeSavedPositions();
    }
  }

  purgeSavedPositions(): void
  {
    var purgedCount = 0;
    var index = 0;
    while (index < this.addedPositions.length)
    {
      if (this.addedPositions[index].saved)
      {
        this.addedPositions.splice(index, 1)
      }
      else
      {
        this.addedPositions[index].saveFailed = false;
        index += 1;
      }
    }
  }

  fetchAttributesFromArray(attributeArray: string[]): PositionAttributeValue[]
  {
    var result = new Array<PositionAttributeValue>();
    var i: number;
    for(i = 0; i < attributeArray.length; i += 1)
    {
      if (attributeArray[i] != null)
      {
        result.push(new PositionAttributeValue(this.getPositionAttribute(i), attributeArray[i]))
      }
    }
    return result;
  }

  getAttributeValues(): PositionAttributeValue[]{
    var result = new Array<PositionAttributeValue>();
    var i: number;
    console.log("add-position.component -- getAttributeValues -- this.attributeValues.length: " + this.attributeValues.length);//TODO:remove
    var keys = Object.keys(this.attributeValues);
    console.log("add-position.component -- getAttributeValues -- keys.length: " + keys.length);//TODO:remove
    for(i = 0; i < keys.length; i += 1)
    {
      console.log("add-position.component -- getAttributeValues -- keys[i]: " + keys[i]);
      console.log("add-position.component -- getAttributeValues -- this.attributeValues[keys[i]]: " + this.attributeValues[keys[i]]);
      var attribute = this.getPositionAttribute(+keys[i]);
      result.push(new PositionAttributeValue(attribute, this.attributeValues[keys[i]]));
    }
    return result;
  }

  getPositionAttribute(id: number): Attribute
  {
    var result: Attribute = null;
    var i: number;
    console.log("add-position.component -- getPositionAttribute -- id: " + id);
    console.log("add-position.component -- getPositionAttribute -- this.attributes.length: " + this.attributes.length);
    for(i = 0; i < this.attributes.length; i += 1)
    {
      console.log("add-position.component -- getPositionAttribute -- this.attributes[i].id: " + this.attributes[i].id);
      if(this.attributes[i].id == id)
      {
        result = this.attributes[i];
      }
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

  tagChanged(index: number): void
  {
    console.log('add-position.component -- tagChanged -- index: ' + index);//TODO: remove
    if(this.addedPositions && this.addedPositions[index])
    {
      this.addedPositions[index].tagError = false;
    }
  }

  propagateAttrValues(index: number): void
  {
    console.log("add-position.component -- propagateAttrValues -- index: " + index); //TODO: remove
    if (index)
    {
      var i: number;
      for(i = 0; i < this.addedPositions[index-1].attributes.length; i += 1)
      {
        if (this.addedPositions[index-1].attributes[i] != null)
        {
          this.addedPositions[index].attributes[i] = this.addedPositions[index-1].attributes[i];
        }      
      }
    }
  }

}
