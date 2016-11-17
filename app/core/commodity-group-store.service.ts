import { Injectable } from '@angular/core';
import { CommodityGroup } from './commodity-group';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommodityGroupStoreService
{
  private _store: CommodityGroup[] = null;
  getAll(): Observable<Array<CommodityGroup>>
  {
    var _resultArray = new Array<CommodityGroup[]>();
    if (!this._store)
    {
    //TODO: replace with the actual implementation
    var _sampleGroups: CommodityGroup[] = [
      {code: "GRP1", description: "Group 1"},
      {code: "GRP2", description: "Group 2"}
    ];
      this._store = _sampleGroups;
    }
    _resultArray.push(this._store);
    return Observable.from(_resultArray);
  }
}
