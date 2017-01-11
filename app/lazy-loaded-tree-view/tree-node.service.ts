import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http , Response } from '@angular/http';
import { TreeNode } from './tree-node';
import { treeNodeReducer } from './tree-node-reducer';
import { treeNodeReducerSingle } from './tree-node-reducer-single';
import { UiStatusService } from '../core/ui-status.service';

@Injectable()
export class TreeNodeService{


  private dispatcher : Subject<any> = new Subject<any>();
  private treeNodes : any = {};

  private nodes : any = {};

  private BASE_URL : string = 'api/Nodes';

  private getChildNodesUrl(id : number) : string
  {
    //return this.BASE_URL + '/' + id + '/nodes.json';
    //return this.BASE_URL + '/' + id + '/nodes.json';
    return this.BASE_URL + '/' + id + '/' + this._uiStatusService.projectDisciplineId + '/nodes';
  }

  private getNodeUrl(id : number) : string
  {
    return this.BASE_URL + '/' + id;
  }

  constructor(private _http:Http, private _uiStatusService: UiStatusService){
    this.dispatcher.subscribe((action) => this.handleAction(action));
  }

  private handleAction(action : any) {

    if(action.name === 'LOAD_NODES') {
      if (this.nodes[action.id]) {
        this.treeNodes[action.id].next(this.nodes[action.id]);
      }
      else {

        this._http
            .get(action.url)
            .map((res:Response) => res.json())
            .subscribe(res => {
              this.nodes[action.id] = treeNodeReducer(res);
              this.treeNodes[action.id].next(this.nodes[action.id]);
            });

      }
    }
    if (action.name === "STORE_NODE"){
      action.node.projectDisciplineId = this._uiStatusService.projectDisciplineId;
      console.log("tree-node.service -- STORE_NODE -- action.node.projectDisciplineId: " + action.node.projectDisciplineId); //TODO:remove
      this._http.post(action.url, action.node)
      .subscribe(res => {
        this.nodes[action.id] = null;
        this.handleAction.bind(this,{name: 'LOAD_NODES', url: 'api/Nodes/' + action.id + '/' + this._uiStatusService.projectDisciplineId + '/nodes', id: action.id});
      });
    }
    if (action.name === "EDIT_NODE"){
      this._http.put(action.url, action.node)
      .subscribe(res => {
        this.nodes[action.id] = null;
        this.handleAction.bind(this,{name: 'LOAD_NODES', url: 'api/Nodes/' + action.id + '/' + this._uiStatusService.projectDisciplineId + '/nodes', id: action.id});
      });
    }
    if (action.name === "DELETE_NODE"){
      this._http.delete(action.url)
      .subscribe(res => {
        this.nodes[action.id] = null;
        this.handleAction.bind(this,{name: 'LOAD_NODES', url: 'api/Nodes/' + action.id + '/' + this._uiStatusService.projectDisciplineId + '/nodes', id: action.id});
      });
    }
  }

  getTreeNodes(id : number){
    if(!this.treeNodes.hasOwnProperty(id)){
      this.treeNodes[id] = new Subject<Array<TreeNode>>();
    }
    return this.treeNodes[id].asObservable();
  }

  persistNode(action: any)
  {
    if (action.name === "STORE_NODE"){
      action.node.projectDisciplineId = this._uiStatusService.projectDisciplineId;
      return this._http.post(action.url, action.node)
      .map((res:Response) => null);
    }
    if (action.name === "EDIT_NODE")
    {
      return this._http.put(action.url, action.node)
      .map((res:Response) => null);
    }
    if (action.name === "DELETE_NODE"){
      return this._http.delete(action.url)
      .map((res:Response) => null);
    }
  }

  dispatchAction(action : any){
    this.dispatcher.next(action);
  }

  getSingleNode(id : number)
  {
    return this._http
        .get(this.getNodeUrl(id))
        .map((res:Response) => treeNodeReducerSingle(res.json()));
  }

  fetchTreeNodes(id : number){
    console.log('tree-node.service -- fetchTreeNodes -- this.getChildNodesUrl(id): ' + this.getChildNodesUrl(id)); //TODO:remove
    return this._http
        .get(this.getChildNodesUrl(id))
        .map((res:Response) => treeNodeReducer(res.json()));

  }
}
