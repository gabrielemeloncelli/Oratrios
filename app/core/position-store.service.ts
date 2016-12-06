import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { BomPosition } from './bom-position';

@Injectable()
export class PositionStoreService{
  private BASE_URL = 'api/positions';
  constructor(private _http: Http){}
  addPosition(newPosition: BomPosition): Observable<BomPosition>
  {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var result = new Subject<BomPosition>();
    this._http.put(this.BASE_URL, JSON.stringify(newPosition), options)
    .map((res:Response) => res.json())
    .subscribe(res => {
      var resultPosition = new BomPosition();
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
      resultPosition.description2 = res.description2;

      result.next(resultPosition);
      }

      );
      return result.asObservable();



  }

  editPosition(modifiedPosition: BomPosition): Observable<BomPosition>
  {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var result = new Subject<BomPosition>();
    this._http.post(this.BASE_URL, JSON.stringify(modifiedPosition), options)
    .map((res:Response) => res.json())
    .subscribe(res => {
      var resultPosition = new BomPosition();
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
      resultPosition.description2 = res.description2;
      result.next(resultPosition);
      }

      );
      return result.asObservable();

  }



  selectNode(nodeId: number): Observable<BomPosition[]>{

    var _resultArray = new Array<BomPosition[]>();
    var result = new Subject<Array<BomPosition>>();
    this._http
        .get(this.BASE_URL + "/node/" + nodeId)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray = new Array<BomPosition>();
          for(var index = 0; index < res.length; index += 1)
          {
            var newPosition: BomPosition = new BomPosition();
            newPosition.id = res[index].id;
            newPosition.nodeId = res[index].nodeId;
            newPosition.materialId = res[index].materialId;
            newPosition.groupCode = res[index].groupCode;
            newPosition.partCode = res[index].partCode;
            newPosition.commodityCode = res[index].commodityCode;
            newPosition.tag = res[index].tag;
            newPosition.description = res[index].description;
            console.log("position-store.service - selectNode - newPosition.description: " + newPosition.description);//TODO: remove  
            newPosition.quantity = res[index].quantity;
            newPosition.isTwm = res[index].isTwm;
            newPosition.description2 = res[index].description2;
            console.log("position-store.service - selectNode - newPosition.description2: " + newPosition.description2);//TODO: remove
            resultArray.push(newPosition);
          }
          result.next(resultArray);
        });
    return result.asObservable();
}


  deletePosition(deletedPosition: BomPosition): Observable<BomPosition>{
    var result = new Subject<BomPosition>();
    this._http
        .delete(this.BASE_URL + "/" + deletedPosition.id)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultPosition = new BomPosition();
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
          resultPosition.description2 = res.description2;
          result.next(resultPosition);
          }

        );
    return result.asObservable();
  }

}
