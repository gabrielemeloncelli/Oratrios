import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';


@Injectable()
export class NodeSelectorService{
  public lastSelectedNode: TreeNode = new TreeNode(0, "", "", "", 0, false, "");

  private selectedNodeSource = new Subject<TreeNode>();

  selectedNode = this.selectedNodeSource.asObservable();


  SelectNode(node: TreeNode)
  {
    this.lastSelectedNode = node;
    this.selectedNodeSource.next(node);
  }


}
