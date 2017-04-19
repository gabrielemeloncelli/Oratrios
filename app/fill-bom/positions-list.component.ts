import { Component,
          ViewChild }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';
import { ToasterModule,
          ToasterService,
          Toast}            from 'angular2-toaster';

import { BomPosition }          from './bom-position';
import { NodeSelectorService }  from './node-selector.service';
import { TreeNode }             from '../lazy-loaded-tree-view/tree-node';
import { PositionService }      from './position.service';
import { UiStatusService }      from '../core/ui-status.service';
import { CommodityGroup }       from './commodity-group';
import { CommodityPart }        from './commodity-part';
import { ModalComponent }       from '../ng2-bs3-modal/components/modal';



@Component({
  selector: "positions-list",
  templateUrl: "app/fill-bom/positions-list.component.html",
  styleUrls: ["app/fill-bom/positions-list.component.css"]
})
export class PositionsListComponent
{
  public nodeName: string;
  public nodeLocked: boolean;
  private _node: TreeNode;
  @ViewChild(ModalComponent)
  confirmModal: ModalComponent;
  private _positionToBeDeleted: BomPosition;
  public loadingVisible = false;

  constructor(private selectorService: NodeSelectorService, public positionsService: PositionService, private uiStatusService: UiStatusService,
    private toasterService: ToasterService)
  {
  }

  ngOnInit(){
    this.nodeName = '-';
    this.nodeLocked = true;
    this.selectorService.selectedNode.subscribe(
      (selectedNode: TreeNode) => { this.updateSelection(selectedNode); }
    );
    this.positionsService.positions.subscribe(() => this.loadingVisible = false);
  }

  editPosition(position: BomPosition)
  {
    this.uiStatusService.editPosition(position);
  }

  deletePosition(position: BomPosition)
  {
    this._positionToBeDeleted = position;
    this.askForConfirmationDeletion();
  }

  updateSelection(selectedNode: TreeNode): void {
    this._node = selectedNode;
    this.nodeName = this._node.name;
    this.nodeLocked = selectedNode.locked;
    this.uiStatusService.commodityGroup = !selectedNode.commodityGroup ? new CommodityGroup(0, "", "") : selectedNode.commodityGroup;
    this.uiStatusService.commodityPart = !selectedNode.commodityPart ? new CommodityPart(0, "", "", this.uiStatusService.commodityGroup.code) : selectedNode.commodityPart;
    this.positionsService.selectNode(selectedNode.id);
    this.loadingVisible = true;
  }
  addCatalogItem()
  {
    this.uiStatusService.setInsertPosition(true, false);
  }

  addTagItem()
  {
    this.uiStatusService.setInsertPosition(true, true);
  }

  askForConfirmationDeletion()
  {
    this.confirmModal.open('sm');
  }

  confirmDeletion()
  {
    console.log("positions-list.component -- confirmDeletion");//TODO: remove
    this.confirmModal.dismiss();
    this.positionsService.deletePosition(this._positionToBeDeleted).subscribe(p => {this.updateSelection(this._node)});
  }
  refreshList()
  {
    this.updateSelection(this._node);
  }

}
