import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { BomPosition } from './bom-position';
import { TreeNode } from '../lazy-loaded-tree-view/tree-node';
import { PositionStoreService } from './position-store.service';


@Injectable()
export class PositionService{
  private _positions: BehaviorSubject<Array<BomPosition>> = new BehaviorSubject(new Array<BomPosition>());
  public positions: Observable<Array<BomPosition>> = this._positions.asObservable();
  private nodeId: number = 0;

  constructor(private _storeService: PositionStoreService){}

  addPosition(newPosition: BomPosition): Observable<BomPosition>
  {
    return this._storeService.addPosition(newPosition);
  }

  editPosition(modifiedPosition: BomPosition): Observable<BomPosition>
  {
    return this._storeService.editPosition(modifiedPosition);
  }

  selectNode(nodeId: number)
  {
    this._storeService.selectNode(nodeId).subscribe(
      positions => this._positions.next(positions)
    );


  }

  deletePosition(position: BomPosition): Observable<BomPosition>
  {
    var result = new Subject<BomPosition>();
    this._storeService.deletePosition(position).subscribe(
      deletedPosition => {
        result.next(deletedPosition);
      }
    );
    return result.asObservable();


  }
}
