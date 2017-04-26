import { Component, OnInit, ViewChild, AfterViewInit }  from '@angular/core';
import { Option }                                       from 'angular2-select/dist/option';
import { SelectComponent }                              from 'angular2-select/dist/select.component';

import { UiStatusService }        from '../core/ui-status.service';
import { ModalComponent }         from '../ng2-bs3-modal/components/modal';
import { CommodityGroup }         from './commodity-group';
import { CommodityGroupService }  from './commodity-group.service';
import { CommodityPart }          from './commodity-part';
import { CommodityPartService }   from './commodity-part.service';
import { MappedTable }            from './mapped-table';
import { CommodityTableService }  from './commodity-table.service';
import { Material }               from './material';
import { MaterialService }        from './material.service';
import { TableAndSizeFilter }     from './table-and-size-filter';
import { TableFilter }            from './table-filter';
import { BomPosition }            from './bom-position';
import { NodeSelectorService }    from './node-selector.service';
import { PositionService }        from './position.service';
import { CommodityTable }         from  './commodity-table';
import { AttributeService }       from './attribute.service';
import { Attribute }              from './attribute';
import { PositionAttributeValue } from './position-attribute-value';
import { PositionInput }          from './position-input';
import { PositionError }          from './position-error';
import { AllowedValue }           from './allowed-value';
import { AllowedValueService }    from './allowed-value.service';


@Component({

selector: "addposition",
templateUrl: "app/fill-bom/add-position.component.html",
styleUrls: ["app/fill-bom/add-position.component.css"  ]

})
export class AddPositionComponent
{

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;
  public groups: Option[] = new Array<Option>();
  public groupsDisabled: boolean = false;
  public parts: Option[] = new Array<Option>();
  public materials: Material[] = new Array<Material>();
  public addedPositions: PositionInput[] = new Array<PositionInput>();
  tables = new Array<MappedTable>();
  private _tableFilters = new Array<TableFilter>();
  public position: BomPosition = new BomPosition();
  public selectedMaterial: Material = null;
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
  private _toBeSavedIndex: number;
  private _allowedUnits: Option[];
  public allowedValues = new Array<Option[]>();
  public hideGroupAndPart = false;
  public filteredMaterialsLoading = false;
  public commoditySelection = false;
  public commoditySelectionError = "";
  public commodityCodeToBeFound: string;


  @ViewChild(SelectComponent)
  private selectComponent: SelectComponent;


  constructor(public uiStatusService: UiStatusService, private commodityGroupService: CommodityGroupService,
     private commodityPartService: CommodityPartService, private commodityTableService: CommodityTableService,
     private materialService: MaterialService, private selectorService: NodeSelectorService,
     private positionService: PositionService, private attributeService: AttributeService,
     private allowedValueService: AllowedValueService)
  {
    this._allowedUnits = new Array<Option>();
    this._allowedUnits.push(new Option("U", "U"));
    this._allowedUnits.push(new Option("M2", "M2"));
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
          this.hideGroupAndPart = !!this.uiStatusService.commodityPart.id;
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
    this.attributeService.attributes.subscribe(
      attributes => {
        this.attributes = attributes;
        for (let attribute of attributes)
        {
          this.allowedValues[attribute.spmatId] = new Array<Option>();
          this.allowedValueService.getAll(attribute.spmatId)
          .subscribe(v => 
          {
            if (true && v && v.length > 0)
            {
              let index = v[0].attributeId;
              this.allowedValues[index] = v.map(v1 =>  new Option(v1.value, v1.value));
            }

          } );
        }
    }
    );
    this.attributeService.getAll(this.uiStatusService.projectDisciplineId);
    if (!!this.uiStatusService.commodityGroup)
    {
      this.selectedMaterial.groupCode = this.uiStatusService.commodityGroup.code;
      if (!!this.uiStatusService.commodityPart.id)
      {
        this.partObjectSelected(this.uiStatusService.commodityPart, false);
      }
    }
    this.allowedValueService.getAll
  }


  ngOnInit()
  {
    this.commodityGroupService.groups.subscribe(
      (groups: CommodityGroup[]) => {
        this.groups = groups.map(g => new Option(g.id.toString(), g.code + " - " + g.description));
        this._groups = groups;
      }
    );

    this.commodityPartService.parts.subscribe(
      (parts: CommodityPart[]) => {
        this.parts = parts.map(p => new Option(p.id.toString(), p.code + " - " + p.description));
        this._parts = parts;
        this.changeGroup();
      }
    );

    this.commodityTableService.tables.subscribe(
      (tables: CommodityTable[]) => {
        setTimeout(() => this.uiStatusService.tablesAndSizesVisible = (this.selectedMaterial.partCode != ""), 100);
        this.tables = tables.map(t => new MappedTable(t));

      }
    );

    this.materialService.materials.subscribe(
      (materials: Material[]) => {
        this.filteredMaterialsLoading = false;
        this.materials = materials;
        if (this._isEdit && this.materials.length > 0)
        {
          this.selectedMaterial = this.materials[0];
        }
      }
    )


  }


  removed(event: any){}

  typed(event: any){}

  groupSelected(event: any)
  {
    var foundGroup: CommodityGroup = this.findSelectedGroup(+event.value);
    this.selectedMaterial.groupCode = foundGroup.code;
    this.uiStatusService.commodityGroup = foundGroup;
    this.commodityPartService.getAll(event.value);//TODO:verify the returned type and property values of the event
  }

  findSelectedGroup(id: number): CommodityGroup{
    var result: CommodityGroup = null;
    var i: number;
    for(i = 0; i < this._groups.length; i += 1)
    {
      if(this._groups[i].id === id)
      {
        result = this._groups[i];
      }
    }
    return result;
  }

  partSelected(event: Option)
  {
    var foundPart: CommodityPart = this.findSelectedPart(+event.value);
    this.partObjectSelected(foundPart, true);
  }

  partObjectSelected(selectedPart: CommodityPart, updateUiStatusService: boolean)
  {
    this.tables = new Array<MappedTable>();
    this._tableFilters = new Array<TableFilter>();
    this.resetPositionModel();
    this.resetMaterial();
    this.materials = new Array<Material>();
    this.selectedMaterial.partId = selectedPart.id;
    this.selectedMaterial.partCode = selectedPart.code;
    this._selectedMaterialVisible = false;
    this.uiStatusService.materialsVisible = false;
    if (updateUiStatusService)
    {
      this.uiStatusService.commodityPart = selectedPart;
    }  
    
    if (this._isTag)
    {
      this._tagAndQuantityVisible = true;
    }
    else
    {
      this.commodityTableService.getAll(this.uiStatusService.disciplineCode, selectedPart.groupCode, selectedPart.code);
    }
    console.log("add-position.component -- partObjectSelected -- this._tagAndQuantityVisible: " + this._tagAndQuantityVisible.toString());//TODO: remove

  }

  findSelectedPart(id: number): CommodityPart{
    var result: CommodityPart = null;
    var i: number;
    for(i = 0; i < this._parts.length; i += 1)
    {
      if(this._parts[i].id === id)
      {
        result = this._parts[i];
      }
    }
    return result;
  }

  tableSelected(event: Option, tableName: string)
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
      foundFilter = new TableFilter(tableName, event.value);
      this._tableFilters.push(foundFilter);
    }
    else
    {
      foundFilter.detail = event.value;
    }
  }

  findMaterial()
  {
    this.uiStatusService.materialsVisible = true;
    this.filteredMaterialsLoading = true;
    var tableFilters: TableFilter[] = new Array<TableFilter>();
    for(var tableIndex = 0; tableIndex < this._tableFilters.length; tableIndex += 1)
    {
      tableFilters.push(new TableFilter(this._tableFilters[tableIndex].tableName, this._tableFilters[tableIndex].detail));
    }
    var filter: TableAndSizeFilter = new TableAndSizeFilter(tableFilters);
    this.materials = new Array<Material>();
    this.materialService.getAll(this.uiStatusService.commodityPart.id, filter);
  }

  tableRemoved(tableName: string)
  {
    var foundFilterPosition = this.findFilterPosition(tableName);
    if (foundFilterPosition > -1)
    {
      this._tableFilters.splice(foundFilterPosition, 1);
    }
  }

  unitRemoved()
  {
    this.selectedMaterial.unit = "";
  }

  unitSelected(option: Option)
  {
    if (option)
    {
      this.selectedMaterial.unit = option.value;
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
    if (this.selectComponent)
    {
      this.selectComponent.clear();
    }
    if (!this.uiStatusService.commodityPart.id)
    {
      this.uiStatusService.commodityGroup = new CommodityGroup(0, "", "");
      this.uiStatusService.commodityPart = new CommodityPart(0, "", "","");
    }
    this.uiStatusService.tablesAndSizesVisible = false;
    this._tableFilters = new Array<TableFilter>();
    if (!this.uiStatusService.commodityPart.id)
    {
      this.resetPart();
    }
    else
    {
      this.partObjectSelected(this.uiStatusService.commodityPart, false);
    }
    this.uiStatusService.materialsVisible = false;
    this._selectedMaterialVisible = false;
    this._tagAndQuantityVisible = false;
    this.commodityCodeToBeFound = "";
    this.commoditySelectionError = "";
    console.log("add-position.component -- partObjectSelected -- this._tagAndQuantityVisible: " + this._tagAndQuantityVisible.toString());//TODO: remove
  }

  resetPart()
  {
    this.changeGroup();
    this.commodityPartService.getAll(-1);
  }

  changeGroup()
  {
    this._selectedMaterialVisible = false || this._isEdit;
    this._tagAndQuantityVisible = false || this._isEdit;
    this.materials = new Array<Material>();
    this.uiStatusService.materialsVisible = false;
    this.uiStatusService.tablesAndSizesVisible = false;
    console.log("add-position.component -- changeGroup -- this._tagAndQuantityVisible: " + this._tagAndQuantityVisible.toString());//TODO: remove
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
    this.commodityCodeToBeFound = "";
    this.commoditySelectionError = "";
    this._isEdit = true;
    this._isTag = positionToEdit.isTwm;
    this.position = positionToEdit;
    this.selectedMaterial.id = positionToEdit.materialId;
    this.selectedMaterial.groupCode = positionToEdit.groupCode;
    this.selectedMaterial.partCode = positionToEdit.partCode;
    this.selectedMaterial.partId = positionToEdit.partId;
    this.selectedMaterial.commodityCode = positionToEdit.commodityCode;
    this.selectedMaterial.description = positionToEdit.description;
    this.selectedMaterial.description2 = positionToEdit.description2;
    this.selectedMaterial.unit = positionToEdit.unit;
    this.setAttributes(positionToEdit.attributes);
    if (!positionToEdit.isTwm) {
      setTimeout(() => this.materialService.getSingle(positionToEdit.materialId, positionToEdit.partId), 100);
    }
    console.log("add-position.component -- editPositionByObject -- this._tagAndQuantityVisible: " + this._tagAndQuantityVisible.toString());//TODO: remove

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
    this.selectedMaterial = new Material(0, "", "", 0, "", "", "", "");
    this.resetMaterialDetails();
  }

  resetMaterialDetails()
  {
    this.selectedMaterial.partCode = "";
    this.selectedMaterial.commodityCode = "";
    this.selectedMaterial.description = "";
    this.selectedMaterial.description2 = "";
    this._description2Keypress = false;
    this.selectedMaterial.unit = "";
    this.attributeValues = new Array<string>();
    this.errorMessage = "";
    this.tagError = false;
  }

  resetPositionModel()
  {
    this.position = new BomPosition();
    this.position.nodeId = this.selectorService.lastSelectedNode.id;
  }

  selectMaterial(materialId: number)
  {
    this.selectedMaterial = this.selectMaterialFromCache(materialId);
    this._selectedMaterialVisible = true;
    this._tagAndQuantityVisible = true;

    var newPosition: BomPosition = new BomPosition();
    newPosition.id = 0;
    newPosition.materialId = this.selectedMaterial.id;
    newPosition.groupCode = this.selectedMaterial.groupCode;
    newPosition.partCode = this.selectedMaterial.partCode;
    newPosition.partId = this.selectedMaterial.partId;
    newPosition.commodityCode = this.selectedMaterial.commodityCode;
    newPosition.description = this.selectedMaterial.description;
    newPosition.description2 = this.selectedMaterial.description2;
    newPosition.unit = this.selectedMaterial.unit;
    newPosition.nodeId = this.position.nodeId;
    newPosition.attributes = new Array<PositionAttributeValue>();

    this.addedPositions.push(new PositionInput(newPosition, new Array<string>()));
    console.log("add-position.component -- selectMaterial -- this._tagAndQuantityVisible: " + this._tagAndQuantityVisible.toString());//TODO: remove

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
    if (this._isEdit || this._isTag)
    {
      this.saveSinglePosition();
    }
    else
    {
      this.savePositionList();
    }
  }

  saveSinglePosition()
  {
    var newPosition: BomPosition = new BomPosition();
    newPosition.id = 0;
    newPosition.materialId = this.selectedMaterial.id;
    newPosition.groupCode = this.selectedMaterial.groupCode;
    newPosition.partCode = this.selectedMaterial.partCode;
    newPosition.partId = this.selectedMaterial.partId;
    newPosition.commodityCode = this.selectedMaterial.commodityCode;
    newPosition.description = this.selectedMaterial.description;
    newPosition.description2 = this.selectedMaterial.description2;
    newPosition.unit = this.selectedMaterial.unit;
    newPosition.isTwm = this._isTag;
    newPosition.nodeId = this.position.nodeId;

    newPosition.tag = this.position.tag;
    newPosition.quantity = this.position.quantity;

    newPosition.attributes = this.getAttributeValues();
    if (this._isEdit){
      this.positionService.editPosition(newPosition).subscribe(
        p => {
          this.selectorService.refreshNode();
        }
      );
    }
    else
    {
      this.positionService.addPosition(newPosition)
        .subscribe(
        p => {
          this.selectorService.refreshNode();
          if(!this._isTag)
          {
            this.modalComponent.dismiss();
          }
          else
          {
            this.clearTag();
          }
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

  clearTag()
  {
    this.selectedMaterial.id = 0;
    this.selectedMaterial.commodityCode = "";
    this.selectedMaterial.description = "";
    this.selectedMaterial.description2 = "";
    this.selectedMaterial.unit = "";
    this.position.tag = "";
    this.position.quantity = null;
    this.clearAttributeValues();
    this._description2Keypress = false;
  }

  savePositionList()
  {
    this.clearErrorMessages();
    var addedBomPositions = new Array<BomPosition>();
    var loopPosition: PositionInput;
    var newPosition: BomPosition;
    var index: number;
    for(index = 0; index < this.addedPositions.length; index += 1)
    {
      newPosition = new BomPosition();
      newPosition.id = 0;
      newPosition.materialId = this.addedPositions[index].bomPosition.materialId;
      newPosition.groupCode = this.addedPositions[index].bomPosition.groupCode;
      newPosition.partCode = this.addedPositions[index].bomPosition.partCode;
      newPosition.partId = this.addedPositions[index].bomPosition.partId;
      newPosition.commodityCode = this.addedPositions[index].bomPosition.commodityCode;
      newPosition.description = this.addedPositions[index].bomPosition.description;
      newPosition.description2 = this.addedPositions[index].bomPosition.description2;
      newPosition.unit = this.addedPositions[index].bomPosition.unit;
      newPosition.isTwm = false;
      newPosition.nodeId = this.position.nodeId;

      newPosition.tag = this.addedPositions[index].bomPosition.tag;
      newPosition.quantity = this.addedPositions[index].bomPosition.quantity;

      newPosition.attributes = this.fetchAttributesFromArray(this.addedPositions[index].attributes);

      addedBomPositions.push(newPosition); 
    }
    this.positionService.addPositionList(addedBomPositions)
    .subscribe(result => {
      this._savedCount = this.addedPositions.length;
      this.checkAllPositionSaved();
    },
    result => {
      this.errorMessage = result.message;
      this.setDetailErrorMessages(this.parseErrorMessages(result.errorObject));
    }
    );
  }

  parseErrorMessages(errorMessages: any[]): PositionError[]
  {
    var result = new Array<PositionError>();
    var loopMessage: any;
    var newMessage: PositionError;
    for (loopMessage of errorMessages)
    {
      newMessage = new PositionError();
      newMessage.index = loopMessage.index;
      newMessage.message = loopMessage.message;
      result.push(newMessage);
    }
    return result;
  }

  setDetailErrorMessages(errorMessages: PositionError[])
  {
    var loopMessage: PositionError;
    for(loopMessage of errorMessages)
    {
      this.addedPositions[loopMessage.index].errorMessage = loopMessage.message;
    }
  }

  clearErrorMessages()
  {
    this.errorMessage = "";
    if (this.addedPositions)
    {
     var position: PositionInput;
     for (position of this.addedPositions)
     {
       position.errorMessage = null;
     }
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
    newPosition.isTwm = false;
    newPosition.nodeId = this.position.nodeId;

    newPosition.tag = this.addedPositions[index].bomPosition.tag;
    newPosition.quantity = this.addedPositions[index].bomPosition.quantity;

    newPosition.attributes = this.fetchAttributesFromArray(this.addedPositions[index].attributes);
    
    this.positionService.addPosition(newPosition)
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
    if (!(this.addedPositions) || this._savedCount === this.addedPositions.length)
    {
      this.selectorService.refreshNode();
      this.modalComponent.dismiss();
      return;
    }
    if (this._toBeSavedIndex < this.addedPositions.length - 1)
    {
      this._toBeSavedIndex += 1;
      this.savePositionInArray(this._toBeSavedIndex);
    }
    else
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
    var keys = Object.keys(this.attributeValues);
    for(i = 0; i < keys.length; i += 1)
    {
      console.log("add-position.component -- getAttributeValues -- keys[i]: " + keys[i]);
      console.log("add-position.component -- getAttributeValues -- this.attributeValues[keys[i]]: " + this.attributeValues[keys[i]]);
      var attribute = this.getPositionAttribute(+keys[i]);
      result.push(new PositionAttributeValue(attribute, this.attributeValues[keys[i]]));
    }
    return result;
  }

  clearAttributeValues()
  {
    var i: number;
    var keys = Object.keys(this.attributeValues);
    for(i = 0; i < keys.length; i += 1)
    {
      this.attributeValues[keys[i]] = "";
    }   
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
      this.selectedMaterial.description2 = this.selectedMaterial.description;
    }
  }

  savePositionLabel(): string
  {
    return this._isEdit ? "Edit" : "Add";
  }

  tagChanged(index: number): void
  {
    if(this.addedPositions && this.addedPositions[index])
    {
      this.addedPositions[index].tagError = false;
    }
  }

  positionHasError(position: PositionInput): boolean
  {
    if (!(position.errorMessage))
    {
      return false;
    }
    return position.errorMessage.length > 0;
  }

  propagateAttrValues(index: number): void
  {
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

  cancelLabel(): string
  {
    if (this._isTag)
    {
      return "Back to BoM";
    }
    return "Cancel";
  }

  dismissModal()
  {
    if (!!this.selectorService.lastSelectedNode && !!this.selectorService.lastSelectedNode.commodityGroup)
    {
      this.uiStatusService.commodityGroup = this.selectorService.lastSelectedNode.commodityGroup;
    }
    else
    {
      this.uiStatusService.commodityGroup = new CommodityGroup(0, "", "");
    }
    if (!!this.selectorService.lastSelectedNode && !!this.selectorService.lastSelectedNode.commodityPart)
    {
      this.uiStatusService.commodityPart = this.selectorService.lastSelectedNode.commodityPart;
    }
    else
    {
      this.uiStatusService.commodityPart = new CommodityPart(0, "", "", this.uiStatusService.commodityGroup.code);
    }

    this.modalComponent.dismiss();
  }

  findCommodityCode()
  {
    this.commoditySelectionError = "";
    this.commoditySelectionError = "Test error";//TODO: replace
  }

}
