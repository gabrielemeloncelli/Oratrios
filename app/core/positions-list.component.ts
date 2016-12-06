import { Component } from '@angular/core';
import { BomPosition } from './bom-position';
import { NodeSelectorService } from './node-selector.service';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';
import { PositionService } from './position.service';
import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable } from 'rxjs/observable';
import { UiStatusService } from './ui-status.service';


@Component({
  selector: "positions-list",
  templateUrl: "app/core/positions-list.component.html"
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

  editPosition(position: BomPosition)
  {
    this._uiStatusService.editPosition(position);
  }

  deletePosition(position: BomPosition)
  {
    this.positionsService.deletePosition(position).subscribe(p => {this.updateSelection(this._node)});
  }

  updateSelection(selectedNode: TreeNode): void {
    this._node = selectedNode;
    this.nodeName = this._node.name;
    this.nodeLocked = selectedNode.locked;
    this.positionsService.selectNode(selectedNode.id);


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
