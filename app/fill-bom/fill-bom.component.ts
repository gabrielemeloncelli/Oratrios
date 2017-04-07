import { Component, Input, OnInit, ViewChild }  from '@angular/core';
import { Router }                               from '@angular/router';
import { Observable }                           from 'rxjs/Observable';

import { BubbleNodeMessageInterface } from '../lazy-loaded-tree-view/bubble-node-message.interface';
import { TreeNode }                   from '../lazy-loaded-tree-view/tree-node';
import { TreeNodeService }            from '../lazy-loaded-tree-view/tree-node.service';
import { CoreEstService }             from './core-est.service';
import { SessionService }             from '../core/session.service';
import { SessionUser }                from '../core/session.service';
import { UiStatusService }            from '../core/ui-status.service';
import { CommodityGroupService }      from './commodity-group.service';
import { ModalComponent }             from '../ng2-bs3-modal/components/modal';
import { NodeDTO }                    from '../lazy-loaded-tree-view/nodeDTO';
import { NodeType }                   from '../core/node-type';

@Component({
  templateUrl: 'app/fill-bom/fill-bom.component.html',
  selector: 'main-view'
})
export class FillBomComponent implements BubbleNodeMessageInterface, OnInit {
  outMessage = this;
  fatherNodeId : number = 0;
  currentNodeId : number = 0;
  nodeNameBg : string = "InitialValue";
  nodeTypeBg : Array<any> = [];
  confirmButtonText : string = "Add";
  nodePositionVisibility : boolean = false;
  nodeType : string = "";
  childSibling : string = 'child';
  actionType : string = '';
  eventNodeView : BubbleNodeMessageInterface = null;
  eventNode : TreeNode = null;
  eventParentNodeView : BubbleNodeMessageInterface = null;
  treeNodeService : TreeNodeService;
  root: TreeNode = null;
  nodeTypes: NodeType[];
  coreService: any;
  coreEstService : CoreEstService;
  nodeLocked : boolean = false;
  selectedNodeType : string = null;
  sessionUser: SessionUser = null;
  sessionService: SessionService = null;
  positionAdd: boolean = false;
  positionIsTag: boolean = false;
  confirmStoreNode: boolean = false;
  warningMessage: string = '';

  constructor (treeNodeService : TreeNodeService, coreEstService : CoreEstService, sessionService: SessionService,
     private _uiStatusService: UiStatusService, private _commodityGroupService: CommodityGroupService,
     private router: Router)
  {
    this.treeNodeService = treeNodeService;
    this.coreEstService = coreEstService;
    this.sessionService = sessionService;

  }

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;



  handleNode(node: TreeNode) : void
  {
    this.confirmStoreNode = false;
    this.warningMessage = '';
    this.nodeLocked = node.locked;
    this.nodeNameBg = node.name;
    this.nodeTypeBg = [{"id": node.type, "name": node.type}];
    this.selectedNodeType = node.type;
    console.log('nodeTypeBg: ' + this.nodeTypeBg);//TODO: remove
    console.log('nodeTypeBg[0]: ' + this.nodeTypeBg[0]);//TODO: remove
    console.log('nodeTypeBg[0].id: ' + this.nodeTypeBg[0].id);//TODO: remove
    this.fatherNodeId = node.idFather;
    this.currentNodeId = node.id;
    this.confirmButtonText = 'Add';
    this.nodePositionVisibility = false;
    this.disabledV = '0';


  }


  addChildNode(node: TreeNode): void
  {
    this.actionType = 'add';
    this.handleNode(node);
    this.nodeNameBg = '';
    this.nodeTypeBg = [];
    this.selectedNodeType = '';
    this.nodePositionVisibility = true;
    this.modalComponent.open();

  }

  editNode(node: TreeNode) : void
  {
    this.actionType = 'edit';
    this.handleNode(node);
    this.confirmButtonText = 'Edit';
    this.modalComponent.open();
  }

  deleteNode(node: TreeNode) : void
  {
    this.actionType = 'delete';
    this.handleNode(node);
    this.confirmButtonText = 'Delete';
    this.modalComponent.open();
    this.disabledV = '1';
  }

  toggleLockNode(node: TreeNode) : void
  {
    console.log('toggleLockNode');//TODO: remove
    this.actionType = 'togglelock';
    this.handleNode(node);
    this.nodeLocked = !node.locked;
    this.storeNode();
  }




   ngOnInit(){


     this._uiStatusService.disciplineCode = "ELEC-MI"; //TODO: replace
     this._commodityGroupService.getAll(this._uiStatusService.disciplineId);
     this.nodeTypes = this._uiStatusService.nodeTypes;
     console.log('app.component - OnInit - this.sessionService.userLogin: ' + this.sessionService.userLogin);//TODO: remove


     this.sessionService.user
     .subscribe((r : SessionUser) =>
     {
       this.sessionUser = r;
       console.log("app.component - OnInit - subscribe callback - session user assigned"); //TODO: remove
       console.log("app.component - OnInit - subscribe callback - this.sessionUser.login: " + this.sessionUser.login); //TODO: remove
       console.log("app.component - OnInit - subscribe callback - this.sessionUser.isAdministrator: " + this.sessionUser.isAdministrator); //TODO: remove
     });

     this._uiStatusService.insertPosition.subscribe(
       details => { this.positionAdd = details.displayInsertPosition;
        this.positionIsTag = details.positionFromTag;
          }
       );
      this._uiStatusService.editPositionObservable.subscribe(
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
      var newNode: NodeDTO = new NodeDTO();
      var action: any;
      newNode.id = this.currentNodeId;
      newNode.name = this.nodeNameBg;
      newNode.nodeType = this.selectedNodeType;
      newNode.locked = this.nodeLocked;
      newNode.lockedBy = this.sessionUser.login;
      console.log("fill-bom.component - storeNode -+- lockedBy: " +  newNode.lockedBy);
      console.log("fill-bom.component - storeNode - nodeType: " +  this.selectedNodeType); //TODO: remove
      newNode.idFather = this.fatherNodeId;
      newNode.url = 'api/Nodes/' + newNode.id;
      newNode.forceDifferentType = forceDifferentType;
      action = { name: null, url: 'api/Nodes/' + this.currentNodeId, node: newNode};
      switch (this.actionType)
      {
        case 'add':
          newNode.id = 0;
          newNode.url = 'api/Nodes/' + newNode.id;
          if (this.childSibling === 'child')
          {
            newNode.idFather = this.eventNode.id;
          }
          else
          {
            newNode.idFather = this.eventParentNodeView.root.id;
          }
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
      if (action.name)
      {
        console.log('fill-bom.component - storeNode - afterActionSwitch - action.url' + action.url);//TODO remove
        this.treeNodeService.persistNode(action)
        .subscribe(() => 
          {
            this.refreshTree();
            this.modalComponent.dismiss();
          }
          , error => 
            {
              console.log('fill-bom.component - storeNode - error.status: ' + error.status);//TODO remove
              if (error.status && error.status === 409)
              {
                console.log('fill-bom.component - storeNode - error.status: ' + error.status);//TODO remove
                this.warningMessage = error.message;
                this.confirmStoreNode = true;
              }
            });
      }   
   }

  storeNode(): void
  {
    var newNode: NodeDTO = new NodeDTO();
    var action: any;
    newNode.id = this.currentNodeId;
    newNode.name = this.nodeNameBg;
    newNode.nodeType = this.selectedNodeType;
    newNode.locked = this.nodeLocked;
    newNode.lockedBy = this.sessionUser.login;
    console.log("fill-bom.component - storeNode -+- lockedBy: " +  newNode.lockedBy);
    console.log("fill-bom.component - storeNode - nodeType: " +  this.selectedNodeType); //TODO: remove
    newNode.idFather = this.fatherNodeId;
    newNode.url = 'api/Nodes/' + newNode.id;
    action = { name: null, url: 'api/Nodes/' + this.currentNodeId, node: newNode};
    switch (this.actionType)
    {
      case 'add':
        newNode.id = 0;
        newNode.url = 'api/Nodes/' + newNode.id;
        if (this.childSibling === 'child')
        {
          newNode.idFather = this.eventNode.id;
        }
        else
        {
          newNode.idFather = this.eventParentNodeView.root.id;
        }
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
    if (action.name)
    {
      console.log('fill-bom.component - storeNode - afterActionSwitch - action.url' + action.url);//TODO remove
      this.treeNodeService.persistNode(action)
      .subscribe(() => {this.refreshTree();});
    }
  }

  bubbleNodeMessage(action: string, callingView: BubbleNodeMessageInterface, parentView: BubbleNodeMessageInterface)
  {
    this.eventNodeView = callingView;
    this.eventParentNodeView = parentView;
    this.eventNode = callingView.root;
    switch (action)
    {
      case 'add':
        this.addChildNode(callingView.root);
        break;
      case 'delete':
        this.deleteNode(callingView.root);
        break;
      case 'edit':
        this.editNode(callingView.root);
        break;
      case 'togglelock':
        this.toggleLockNode(callingView.root);
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
        if (this.childSibling === 'child')
        {
          this.eventNodeView.refreshCurrentNode(true);
        }
        else
        {
          this.eventParentNodeView.refreshCurrentNode(true);
        }
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

  /* *****************************************
  Test dropdown selector
  ******************************************* */


  private value:any = {};
  private _nodeTypeDisabledV:string = '0';
  private nodeTypeDisabled:boolean = false;

  private get disabledV():string {
    return this._nodeTypeDisabledV;
  }

  private set disabledV(value:string) {

    this._nodeTypeDisabledV = value;
    this.nodeTypeDisabled = this._nodeTypeDisabledV === '1';
    console.log("app.component - disabledV - nodeTypeDisabled: " + this.nodeTypeDisabled); //TODO: remove
  }


  public nodeTypeSelected2(value: NodeType):void {
    console.log('Selected value is: ', value);
    this.selectedNodeType = value.code;
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
  /* *****************************************
  End Test dropdown selector
  ******************************************* */
}