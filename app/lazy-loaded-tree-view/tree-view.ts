import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from './tree-node';
//import {Store} from './redux/store';
import {TreeNodeService} from './tree-node.service';
import { BubbleNodeMessageInterface } from './bubble-node-message.interface';
import { SessionService, SessionUser } from '../core/session.service';
import { NodeSelectorService } from '../core/node-selector.service';


@Component({
  templateUrl:'app/lazy-loaded-tree-view/tree-view.html',
  styleUrls:['app/lazy-loaded-tree-view/tree-view.css'],
  selector:'tree-view',
})

export class TreeView implements OnInit, BubbleNodeMessageInterface{

  @Input() root:TreeNode;
  children:any;
  items:any[] = [];
  @Input() message: any;
  @Input() parentView: any;
  currentView: any;
  outMessage: any;
  sessionUser: SessionUser;


  constructor(private _treeNodeService: TreeNodeService, private _sessionService: SessionService, private _selectorService: NodeSelectorService){
    this.currentView = this;
    console.log('tree-view - constructor - this._sessionService.user: ' + !!this._sessionService.user);//TODO: remove
  }

  refreshCurrentNode(modifiedChildNode: boolean) : void {
    console.log("tree-view - refreshCurrentNode - root exixst: " + !!this.root); //TODO: remove
    console.log("tree-view - refreshCurrentNode - root.id: " + this.root.id); //TODO: remove
    this._treeNodeService.getSingleNode(this.root.id)
     .subscribe((r:any) => {
       this.root.url = r.url;
       this.root.name = r.name;
       this.root.type = r.type;
       this.root.locked = r.locked;
       this.root.lockedBy = r.lockedBy;
      if (modifiedChildNode)
      {
        if (this.root.expanded)
        {
          this.root.expand();
        }
        this.root.expand();
        this.refreshChildNodes();
      }
    } );
  }

  refreshChildNodes() : void {
    if (this.root.url)
    {
    this._treeNodeService.fetchTreeNodes(this.root.id)
      .subscribe((r:any) => {  this.items = r; });
    }
  }

  ngOnInit(){
    //this.subscription = this._store.getTreeNodes(this.root.id).subscribe((res:any) => {
    //  this.items = res;
    //});
    //this._treeNodeService.loadTreeNodes(this.root);
    this.outMessage = this;
    if(this.root.expanded)
    {
      this.refreshChildNodes();
    }
    this._sessionService.user.subscribe(
      u => this.sessionUser = u
    );



  }

  public get enabled(): boolean
  {
    if (!this.sessionUser)
    {
      return false;
    }
    if (this.sessionUser.isAdministrator)
    {
      return true;
    }
    if (!!this.root && this.sessionUser.login === this.root.lockedBy)
    {
      return true;
    }
    return false;
  }

  public get lockClasses(): string
  {
   {
      if (this.root.locked)
      {
        if (this.enabled)
        {
          return "btn btn-warning btn-xs pull-right";
        }
        else
        {
          return "btn btn-danger btn-xs pull-right";
        }
      }
      else
      {
        return "btn btn-success btn-xs pull-right";
      }

    }
  }

  expand() : void  {
    this.root.expand();
    if(this.root.expanded === true)
    {
      this.refreshChildNodes();
    }
  }

  ngOnDestroy(){
  }

  addNode()
  {
    this.bubbleNodeMessage('add', this, this.parentView);
  }

  bubbleNodeMessage(action: string, callingView: BubbleNodeMessageInterface, parentView: BubbleNodeMessageInterface)
  {
    this.message.bubbleNodeMessage(action, callingView, parentView);
  }

  editNode()
  {
    this.bubbleNodeMessage('edit', this, this.parentView);
  }

  deleteNode()
  {
    this.bubbleNodeMessage('delete', this, this.parentView);
  }

  persistNode(action: any)
  {
    this._treeNodeService.persistNode(action)
      .subscribe(() => {this.refreshChildNodes();})
  }

  toggleLockNode()
  {
    this.bubbleNodeMessage('togglelock', this, this.parentView);
  }

  selectRoot()
  {
    this._selectorService.SelectNode(this.root);
    console.log("TreeWiewComponent - selector service invoked." + this.root.id); //TODO: remove
  }

}
