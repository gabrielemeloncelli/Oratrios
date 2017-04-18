import { Component, Input, OnInit, ViewChild }  from '@angular/core';
import { Router }                               from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Option }                               from 'angular2-select/dist/option';
import { SelectComponent }                      from 'angular2-select/dist/select.component';

import { BubbleNodeMessageInterface } from '../lazy-loaded-tree-view/bubble-node-message.interface';
import { TreeNode }                   from '../lazy-loaded-tree-view/tree-node';
import { TreeNodeService }            from '../lazy-loaded-tree-view/tree-node.service';
import { CoreEstService }             from './core-est.service';
import { SessionService }             from '../core/session.service';
import { SessionUser }                from '../core/session.service';
import { UiStatusService }            from '../core/ui-status.service';
import { CommodityGroupService }      from './commodity-group.service';
import { CommodityPartService }       from './commodity-part.service';
import { ModalComponent }             from '../ng2-bs3-modal/components/modal';
import { NodeDTO }                    from '../lazy-loaded-tree-view/nodeDTO';
import { NodeType }                   from '../core/node-type';
import { CommodityGroup }             from './commodity-group';
import { CommodityPart }              from './commodity-part';

@Component({
  templateUrl: 'app/fill-bom/fill-bom.component.html',
  selector: 'main-view'
})
export class FillBomComponent implements BubbleNodeMessageInterface, OnInit {
  outMessage = this;
  confirmButtonText : string = "Add";
  actionType : string = '';
  eventNodeView : BubbleNodeMessageInterface = null;
  eventNode : TreeNode = null;
  eventParentNodeView : BubbleNodeMessageInterface = null;
  treeNodeService : TreeNodeService;
  root: TreeNode = null;
  nodeTypes: NodeType[];
  coreService: any;
  coreEstService : CoreEstService;
  sessionUser: SessionUser = null;
  sessionService: SessionService = null;
  positionAdd: boolean = false;
  positionIsTag: boolean = false;
  confirmStoreNode: boolean = false;
  warningMessage: string = '';
  nodeTypeOptions: Option[];
  @ViewChild('nodeTypeSelector')
  nodeSelectorComponent: SelectComponent;
  nodeTypeChangeDisabled: boolean;
  nodeSelectorPlaceholder: string;
  nameIsPullDown: boolean;
  nodeNameOptions: Option[];
  commodityGroups: CommodityGroup[] = new Array<CommodityGroup>();
  commodityParts: CommodityPart[] = new Array<CommodityPart>();
  changedNode = new TreeNode(0,"","","",0,false,"",null, null);

  constructor (treeNodeService : TreeNodeService, coreEstService : CoreEstService, sessionService: SessionService,
     private uiStatusService: UiStatusService, private commodityGroupService: CommodityGroupService,
     private router: Router, private commodityPartService: CommodityPartService)
  {
    this.treeNodeService = treeNodeService;
    this.coreEstService = coreEstService;
    this.sessionService = sessionService;
    console.log("fill-bom.component -- constructor -- !!this.uiStatusService.commodityPart: " + !!this.uiStatusService.commodityPart); //TODO: remove
    console.log("fill-bom.component -- constructor -- this.uiStatusService.commodityPart.id: " + this.uiStatusService.commodityPart.id); //TODO: remove

  }

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;



  handleNode(): void
  {
    this.confirmStoreNode = false;
    this.warningMessage = '';
    this.confirmButtonText = 'Add';
    this.nodeNameDisabled = false;
    this.nodeTypeChangeDisabled = false;
    this.nameIsPullDown = false;
   
    if (!!this.nodeSelectorComponent)
    {
      if (!!this.nodeSelectorComponent.value)
      {
        this.nodeSelectorComponent.clear();
      }
    }

  }


  addChildNode(): void
  {
    this.actionType = 'add';
    this.changedNode = new TreeNode(0, "", "", "", this.eventNode.id, false, "", null, null)
    this.handleNode();
    if (this.eventNode && !!this.eventNode.commodityGroup && !this.eventNode.commodityPart)
    {
      this.changedNode.commodityGroup = this.eventNode.commodityGroup;
      this.changedNode.type = this.uiStatusService.PART_CODE;
      this.nodeTypeChangeDisabled = true;
      this.nameIsPullDown = true;
      this.nodeNameOptions = new Array<Option>();
      if (this.eventNode && this.eventNode.commodityGroup)
      {
        this.commodityPartService.getAll(this.eventNode.commodityGroup.id);
      }
    }
    this.modalComponent.open();

  }

  editNode() : void
  {
    this.actionType = 'edit';
    this.changedNode = this.eventNode;
    this.handleNode();
    this.confirmButtonText = 'Edit';
    this.modalComponent.open();
  }

  deleteNode() : void
  {
    this.actionType = 'delete';
    this.changedNode = this.eventNode;
    this.handleNode();
    this.confirmButtonText = 'Delete';
    this.modalComponent.open();
    this.nodeNameDisabled = true;
    this.nodeTypeChangeDisabled = true;
  }

  toggleLockNode() : void
  {
    this.actionType = 'togglelock';
    this.changedNode = this.eventNode;
    this.handleNode();
    this.changedNode.locked = !this.eventNode.locked;
    this.storeNode();
  }

  createNodeTypeOptions(): Option[]
  {
    let result = new Array<Option>();
    for(let loopNodeType of this.nodeTypes)
    {
      if (loopNodeType.code != this.uiStatusService.PART_CODE)
      {
        result.push(new Option(loopNodeType.code, loopNodeType.code + " - " + loopNodeType.description));
      }
    }
    return result;
  }

  createPartNameOptions(parts: CommodityPart[]): Option[]
  {
    this.commodityParts = parts;
    return parts.map(p => new Option(p.id.toString(), p.code + " - " + p.description));
  }

  createGroupNameOptions(): Option[]
  {
    // TODO: remove
    // ****************************
    //
    console.log("fill-bom.component -- createGroupNameOptions -- this.commodityGroups:" + this.commodityGroups);
    if (!!this.commodityGroups)
    {
      console.log("fill-bom.component -- createGroupNameOptions -- this.commodityGroups.length:" + this.commodityGroups.length);
    }
    // *************************** 
    return this.commodityGroups.map(g => new Option(g.id.toString(), g.code + " - " + g.description));
  }





   ngOnInit(){    
     this.commodityGroupService.getAll(this.uiStatusService.disciplineId);
     this.nodeTypes = this.uiStatusService.nodeTypes;
     console.log('app.component - OnInit - this.sessionService.userLogin: ' + this.sessionService.userLogin);//TODO: remove


     this.sessionService.user
     .subscribe((r : SessionUser) =>
     {
       this.sessionUser = r;
       console.log("app.component - OnInit - subscribe callback - session user assigned"); //TODO: remove
       console.log("app.component - OnInit - subscribe callback - this.sessionUser.login: " + this.sessionUser.login); //TODO: remove
       console.log("app.component - OnInit - subscribe callback - this.sessionUser.isAdministrator: " + this.sessionUser.isAdministrator); //TODO: remove
     });

     this.uiStatusService.insertPosition.subscribe(
       details => { this.positionAdd = details.displayInsertPosition;
        this.positionIsTag = details.positionFromTag;
          }
       );
      this.uiStatusService.editPositionObservable.subscribe(
        position => { this.positionAdd = true;
          if (position) {
         this.positionIsTag = position.isTwm;
       }
       else
       {
         this.positionIsTag = false;
       }
         }
      );
      this.nodeTypeOptions = this.createNodeTypeOptions();
      this.nodeSelectorPlaceholder = "Select / Change node type";
      this.commodityGroupService.groups.subscribe(g => this.commodityGroups = g);
      this.commodityPartService.parts.subscribe(p => this.nodeNameOptions = this.createPartNameOptions(p));
      
   }

   tryStoreNode(): void
   {
      return this.baseStoreNode(false);
   }

   storeNodeConfirm(): void
   {
     return this.baseStoreNode(true);
   }

   baseStoreNode(forceDifferentType: boolean): void
   {
     var newNode = this.createNodeDTO();
     newNode.forceDifferentType = forceDifferentType;
     var action = this.createNodeAction(newNode);
     if (action.name)
     {
       this.treeNodeService.persistNode(action)
       .subscribe(
        () =>
        {
          this.refreshTree();
          this.modalComponent.dismiss();
        },
        error =>
          {
            if (error.status && error.status === 409)
            {
              this.warningMessage = error.message;
              this.confirmStoreNode = true;
            }
          });
      }   
   }

  storeNode(): void
  {
    var newNode = this.createNodeDTO();
    var action = this.createNodeAction(newNode);
    if (action.name)
    {
      this.treeNodeService.persistNode(action)
      .subscribe(() => {this.refreshTree();});
    }
  }

  private createNodeDTO(): NodeDTO
  {

    var newNode: NodeDTO = new NodeDTO();
    newNode.id = 0;
    newNode.nodeType = this.changedNode.type;
    newNode.name = this.changedNode.name;
    newNode.locked = this.changedNode.locked;
    newNode.lockedBy = this.sessionUser.login;
    newNode.idFather = this.changedNode.idFather;
    newNode.url = 'api/Nodes/' + newNode.id;
    newNode.commodityGroup = this.changedNode.commodityGroup;
    newNode.commodityPart = this.changedNode.commodityPart;
    
    return newNode;
  }

  private createNodeAction(newNode: NodeDTO): any
  {
    var action: any;
    action = { name: null, url: 'api/Nodes/' + this.eventNode.id.toString(), node: newNode};
    switch (this.actionType)
    {
      case 'add':
        newNode.id = 0;
        newNode.url = 'api/Nodes/' + newNode.id;
        newNode.idFather = this.eventNode.id;
        action.name = 'STORE_NODE';
        action.url = 'api/Nodes';
        break;
      case 'edit':
      case 'togglelock':
        action.name = 'EDIT_NODE';
        break;
      case 'delete':
        action.name = 'DELETE_NODE';
        break;
    }
    return action;
  }

  bubbleNodeMessage(action: string, callingView: BubbleNodeMessageInterface, parentView: BubbleNodeMessageInterface)
  {
    this.eventNodeView = callingView;
    this.eventParentNodeView = parentView;
    this.eventNode = callingView.root;
    switch (action)
    {
      case 'add':
        this.addChildNode();
        break;
      case 'delete':
        this.deleteNode();
        break;
      case 'edit':
        this.editNode();
        break;
      case 'togglelock':
        this.toggleLockNode();
        break;
    }

  }

  refreshTree()
  {
    console.log('Refreshing tree'); //TODO: remove
    console.log('actionType: ' + this.actionType);//TODO: remove
    switch(this.actionType)
    {
      case 'add':
        this.eventNodeView.refreshCurrentNode(true);
        break;
      case 'delete':
        this.eventParentNodeView.refreshCurrentNode(true);
        break;
      case 'edit':
      case 'togglelock':
        this.eventNodeView.refreshCurrentNode(false);
        break;
    }

  }

  refreshChildNodes() : void {}

  refreshCurrentNode(modifiedChildNode : boolean) : void {}

  public exportFile()
  {
    console.log('add-position.component -- exportFile'); //TODO remove
    this.router.navigate(['/export']);
  }


  private value:any = {};
  private nodeNameDisabled:boolean = false;




  public nodeTypeSelected(value: Option):void {
    this.changedNode.type = value.value;
    this.nameIsPullDown = false;
    if (this.changedNode.type === this.uiStatusService.GROUP_CODE)
    {
      this.nameIsPullDown = true;
      this.nodeNameOptions = this.createGroupNameOptions();
    }
    else
    {
      this.changedNode.commodityGroup = null;
      this.changedNode.commodityPart = null;
    }
  }

  public nodeNameSelected(value: Option):void {
    this.changedNode.name = this.selectGroupOrPart(+value.value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

  private selectGroupOrPart(entityId: number): string
  {
    console.log("fill-bom.component -- selectGroupOrPart -- entityId: " + entityId.toString());//TODO:remove
    var entityCode= "";
    var useGroup = (!!this.eventNode.commodityGroup && !this.eventNode.commodityPart && this.actionType === "add")
     || (!!this.eventNode.commodityGroup && !!this.eventNode.commodityPart && this.actionType === "edit");
    console.log("fill-bom.component -- selectGroupOrPart -- useGroup: " + useGroup.toString());//TODO:remove
    if (useGroup)
    {
      var filteredPart = this.commodityParts.filter(p => p.id === entityId);
      if (filteredPart.length > 0)
      {
        entityCode = filteredPart[0].code;
        this.changedNode.commodityPart = filteredPart[0];
      }
    }
    else
    {
      var filteredGroup = this.commodityGroups.filter(g => g.id === entityId);
      if (filteredGroup.length > 0)
      {
        entityCode = filteredGroup[0].code;
        this.changedNode.commodityGroup = filteredGroup[0];
      }
    }

    return entityCode;
  }

}
