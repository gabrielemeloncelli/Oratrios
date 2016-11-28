import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { Position } from './position';

@Injectable()
export class PositionStoreService{
  private BASE_URL = '/api/positions';
  constructor(private _http: Http){}
  addPosition(newPosition: Position): Observable<Position>
  {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var result = new Subject<Position>();
    this._http.put(this.BASE_URL, JSON.stringify(newPosition), options)
    .map((res:Response) => res.json())
    .subscribe(res => {
      var resultPosition = new Position();
      resultPosition.id = res.id;
      resultPosition.nodeId = res.nodeId;
      resultPosition.materialId = res.materialId;
      resultPosition.groupCode = res.groupCode;
      resultPosition.partCode = res.partCode;
      resultPosition.commodityCode = res.commodityCode;
      resultPosition.tag = res.tag;
      resultPosition.description = res.description;
      resultPosition.quantity = res.quantity;
      resultPosition.isTwm = res.isTwm;

      result.next(resultPosition);
      }

      );
      return result.asObservable();
      /*

    var subject = new Subject<Position>();
    //TODO: implement
    return subject.asObservable();
    */
  }

  selectNode(nodeId: number): Observable<Position[]>{

    var _resultArray = new Array<Position[]>();
    var result = new Subject<Array<Position>>();
    this._http
        .get(this.BASE_URL + "/" + nodeId)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray = new Array<Position>();
          for(var index = 0; index < res.length; index += 1)
          {
            var newPosition: Position = new Position();
            newPosition.id = res[index].id;
            newPosition.nodeId = res[index].nodeId;
            newPosition.materialId = res[index].materialId;
            newPosition.groupCode = res[index].groupCode;
            newPosition.partCode = res[index].partCode;
            newPosition.commodityCode = res[index].commodityCode;
            newPosition.tag = res[index].tag;
            newPosition.description = res[index].description;
            newPosition.quantity = res[index].quantity;
            newPosition.isTwm = res[index].isTwm;

            resultArray.push(newPosition);
          }
          result.next(resultArray);
        });
    return result.asObservable();
}


  deletePosition(deletedPosition: Position): Observable<Position>{
    var result = new Subject<Position>();
    this._http
        .delete(this.BASE_URL + "/" + deletedPosition.id)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultPosition = new Position();
          resultPosition.id = res.id;
          resultPosition.nodeId = res.nodeId;
          resultPosition.materialId = res.materialId;
          resultPosition.groupCode = res.groupCode;
          resultPosition.partCode = res.partCode;
          resultPosition.commodityCode = res.commodityCode;
          resultPosition.tag = res.tag;
          resultPosition.description = res.description;
          resultPosition.quantity = res.quantity;
          resultPosition.isTwm = res.isTwm;

          result.next(resultPosition);
          }

        );
    return result.asObservable();
  }
}
