import { TreeNode } from './tree-node';

export const treeNodeReducerSingle = (state: any) => {
  if (state)
  {
      return new TreeNode(state.id, state.url, state.name, state.nodeType, state.idFather, state.locked, state.lockedBy);
    }
    return new TreeNode(0, '/api/Nodest/0/nodes.json', 'Project F01233', 'project', 0, false, '');
};
