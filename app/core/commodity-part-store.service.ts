import { Injectable } from '@angular/core';
import { CommodityPart } from './commodity-part';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommodityPartStoreService
{
  private _store: CommodityPart[][] = new Array<CommodityPart[]>();
  getAll(groupCode: string): Observable<Array<CommodityPart>>
  {
    var _resultArray = new Array<CommodityPart[]>();
    if (!this._store[groupCode])
    {
    //TODO: replace with the actual implementation
    var _sampleParts: CommodityPart[] = [
      {code: "PRT1", description: "Part 1"},
      {code: "PRT2", description: "Part 2"}
    ];
    if(groupCode === '@#')
    {
      _sampleParts = new Array<CommodityPart>();
    }
    this._store[groupCode] = _sampleParts;
  }
    _resultArray.push(this._store[groupCode]);
    return Observable.from(_resultArray);
  }
}
