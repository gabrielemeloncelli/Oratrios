import { Injectable } from '@angular/core';
import { Material } from './material';
import { Observable } from 'rxjs/Observable';
import { TableAndSizeFilter } from './table-and-size-filter';

@Injectable()
export class MaterialStoreService
{
  private _store: Material[][] = new Array<Material[]>();
  getAll(groupCode: string, partCode: string, filter: TableAndSizeFilter): Observable<Array<Material>>
  {
    var cacheKey = groupCode + "--------" + partCode;
    if (filter)
    {
      cacheKey += "--------" + filter.cacheKey;
    }
    var _resultArray = new Array<Material[]>();
    if (!this._store[cacheKey])
    {
    //TODO: replace with the actual implementation
    var _sampleMaterials: Material[] = [
      new Material(1, "GRP1", "PRT1", "I234566", "G1P1343AFD33DSE", "10X12", "Material with some nontrivial mocked description to check display settings"),
      new Material(2, "GRP1", "PRT1", "I234569", "G1P1343AFD33DSE", "10X15", "Material with some nontrivial mocked description to check display settings")
    ];
      this._store[cacheKey] = _sampleMaterials;
    }
    _resultArray.push(this._store[cacheKey]);
    return Observable.from(_resultArray);
  }
}
