import { Injectable } from "@angular/core";
import { NodeDTO } from "./lazy-loaded-tree-view/nodeDTO";
import { NODES } from "./mock-nodes";

@Injectable()
export class NodeService{
  getNodes(idFather : number): NodeDTO[]
  {
    var result : NodeDTO[];
    result = new NodeDTO[0];
    var currentNode : NodeDTO;
    for(currentNode of NODES)
    {
      if (currentNode.idFather === idFather)
      {
        result.push(currentNode);
      }
    }
    return result;
  }
}
