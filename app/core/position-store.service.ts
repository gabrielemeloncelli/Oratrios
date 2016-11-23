import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { Position } from './position';

@Injectable()
export class PositionStoreService{
  addPosition(newPosition: Position): Observable<Position>
  {
    var subject = new Subject<Position>();
    //TODO: implement
    return subject.asObservable();
  }

  selectNode(nodeId: number): Observable<Position[]>{
    var result = new Subject<Position[]>();
    var rnd: number = Math.random() * 3 + 2;
    var baseQty: number = Math.floor(Math.random() * 25 + 1);
    var mockedPositions: Array<Position> = new Array<Position>();
    var mockedPosition: Position;
    for (var idx: number = 0; idx < rnd; idx += 1)
    {
      mockedPosition = new Position();
      mockedPosition.nodeId = nodeId;
      mockedPosition.groupCode = "GRP";
      mockedPosition.partCode = "PRT";
      mockedPosition.commodityCode = "CMM0124RWI39939DD";
      mockedPosition.description = "Mocked description";
      mockedPosition.quantity = baseQty + idx * 0.5;
      mockedPositions.push(mockedPosition);
    }
    setTimeout(() => result.next(mockedPositions), 100);
    return result.asObservable();

  }

  deletePosition(deletedPosition: Position): Observable<Position>{
    var result = new Subject<Position>();
    setTimeout(() => result.next(deletedPosition), 100);
    //TODO: implement
    return result.asObservable();
  }
}
