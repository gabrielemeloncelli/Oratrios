import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';
import { Subject }      from 'rxjs/Subject';

import { BomPosition }          from './bom-position';
import { PositionStoreService } from './position-store.service';
import { PositionErrorList }    from './position-error-list';


@Injectable()
export class PositionService{
  private _positions: Subject<Array<BomPosition>> = new Subject<Array<BomPosition>>();
  public positions: Observable<Array<BomPosition>> = this._positions.asObservable();
  private nodeId: number = 0;

  constructor(private _storeService: PositionStoreService){}

  addPosition(newPosition: BomPosition): Observable<BomPosition>
  {
    return this._storeService.addPosition(newPosition);
  }

  addPositionList(newPositions: BomPosition[]): Observable<PositionErrorList>
  {
    return this._storeService.addPositionList(newPositions);
  }

  editPosition(modifiedPosition: BomPosition): Observable<BomPosition>
  {
    return this._storeService.editPosition(modifiedPosition);
  }

  selectNode(nodeId: number)
  {
    this._positions.next(new Array<BomPosition>());
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
