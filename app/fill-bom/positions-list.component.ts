import { Component }        from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';

import { BomPosition }          from './bom-position';
import { NodeSelectorService }  from './node-selector.service';
import { TreeNode }             from '../lazy-loaded-tree-view/tree-node';
import { PositionService }      from './position.service';
import { UiStatusService }      from '../core/ui-status.service';
import { CommodityGroup }       from './commodity-group';
import { CommodityPart }        from './commodity-part';


@Component({
  selector: "positions-list",
  templateUrl: "app/fill-bom/positions-list.component.html"
})
export class PositionsListComponent
{
  public nodeName: string;
  public nodeLocked: boolean;
  private _node: TreeNode;
  constructor(private _selectorService: NodeSelectorService, public positionsService: PositionService, private uiStatusService: UiStatusService)
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
    this.uiStatusService.editPosition(position);
  }

  deletePosition(position: BomPosition)
  {
    this.positionsService.deletePosition(position).subscribe(p => {this.updateSelection(this._node)});
  }

  updateSelection(selectedNode: TreeNode): void {
    this._node = selectedNode;
    this.nodeName = this._node.name;
    this.nodeLocked = selectedNode.locked;
    this.uiStatusService.commodityGroup = !selectedNode.commodityGroup ? new CommodityGroup(0, "", "") : selectedNode.commodityGroup;
    this.uiStatusService.commodityPart = !selectedNode.commodityPart ? new CommodityPart(0, "", "", this.uiStatusService.commodityGroup.code) : selectedNode.commodityPart;
    this.positionsService.selectNode(selectedNode.id);


    }
    addCatalogItem()
    {
      this.uiStatusService.setInsertPosition(true, false);
    }

    addTagItem()
    {
      this.uiStatusService.setInsertPosition(true, true);
    }

}
