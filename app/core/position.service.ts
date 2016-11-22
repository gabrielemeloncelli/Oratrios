import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { Position } from './position';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';

@Injectable()
export class PositionService{
  private _positions: BehaviorSubject<Array<Position>> = new BehaviorSubject(new Array<Position>());
  public positions: Observable<Array<Position>> = this._positions.asObservable();
  private nodeId: number = 0;




  selectNode(selectedNode: TreeNode)
  {
    this.nodeId = selectedNode.id;
    var rnd: number = Math.random() * 3 + 2;
    var baseQty: number = Math.floor(Math.random() * 25 + 1);
    var mockedPositions: Array<Position> = new Array<Position>();
    var mockedPosition: Position;
    for (var idx: number = 0; idx < rnd; idx += 1)
    {
      mockedPosition = new Position();
      mockedPosition.groupCode = "GRP";
      mockedPosition.partCode = "PRT";
      mockedPosition.commodityCode = "CMM0124RWI39939DD";
      mockedPosition.description = "Mocked description";
      mockedPosition.quantity = baseQty + idx * 0.5;
      mockedPositions.push(mockedPosition);
    }

    this._positions.next(mockedPositions);

  }

  deletePosition(position: Position){
    this.selectNode(new TreeNode(this.nodeId, "", "", "", 0, false, ""));
  }
}
