import { Component } from '@angular/core';
import { Position } from './position';
import { NodeSelectorService } from './node-selector.service';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';
import { PositionService } from './position.service';
import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable } from 'rxjs/observable';
import { UiStatusService } from './ui-status.service';


@Component({
  selector: "positions-list",
  templateUrl: "/app/core/positions-list.component.html"
})
export class PositionsListComponent
{
  public nodeName: string;
  public nodeLocked: boolean;
  private _node: TreeNode;
  constructor(private _selectorService: NodeSelectorService, public positionsService: PositionService, private _uiStatusService: UiStatusService)
  {
  }

  ngOnInit(){
    this.nodeName = '-';
    this.nodeLocked = true;
    this._selectorService.selectedNode.subscribe(
      (selectedNode: TreeNode) => { this.updateSelection(selectedNode); }
    );
  }

  editPosition(position: Position)
  {
    console.log("position-list.component editPosition :" + position.quantity); //TODO: remove and complete
  }

  deletePosition(position: Position)
  {
    this.positionsService.deletePosition(position);
  }

  updateSelection(selectedNode: TreeNode): void {
    this._node = selectedNode;
    this.nodeName = this._node.name;
    this.nodeLocked = selectedNode.locked;
    this.positionsService.selectNode(selectedNode);


    }
    addCatalogItem()
    {
      this._uiStatusService.setInsertPosition(true, false);
    }

    addTagItem()
    {
      this._uiStatusService.setInsertPosition(true, true);
    }

}
