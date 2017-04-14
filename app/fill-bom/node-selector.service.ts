import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';


@Injectable()
export class NodeSelectorService{
  public lastSelectedNode: TreeNode = new TreeNode(0, "", "", "", 0, false, "", null, null);

  private selectedNodeSource = new Subject<TreeNode>();

  selectedNode = this.selectedNodeSource.asObservable();


  selectNode(node: TreeNode)
  {
    this.lastSelectedNode = node;
    this.selectedNodeSource.next(node);
  }

  refreshNode()
  {
    this.selectNode(this.lastSelectedNode);
  }


}
