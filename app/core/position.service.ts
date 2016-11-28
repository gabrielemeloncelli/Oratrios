import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { Position } from './position';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';
import { PositionStoreService } from './position-store.service';


@Injectable()
export class PositionService{
  private _positions: BehaviorSubject<Array<Position>> = new BehaviorSubject(new Array<Position>());
  public positions: Observable<Array<Position>> = this._positions.asObservable();
  private nodeId: number = 0;

  constructor(private _storeService: PositionStoreService){}

  addPosition(newPosition: Position): Observable<Position>
  {
    return this._storeService.addPosition(newPosition);
  }

  selectNode(nodeId: number)
  {
    this._storeService.selectNode(nodeId).subscribe(
      positions => this._positions.next(positions)
    );


  }

  deletePosition(position: Position): Observable<Position>
  {
    var result = new Subject<Position>();
    this._storeService.deletePosition(position).subscribe(
      deletedPosition => {
        result.next(deletedPosition);
      }
    );
    return result.asObservable();


  }
}
