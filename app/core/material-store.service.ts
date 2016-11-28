import { Injectable } from '@angular/core';
import { Material } from './material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/subject';
import { TableAndSizeFilter } from './table-and-size-filter';
import { Http, Response } from '@angular/http';

@Injectable()
export class MaterialStoreService
{
  private BASE_URL = '/api/materials';
  constructor(private _http: Http){}

  private _store: Material[][] = new Array<Material[]>();
  getAll(groupCode: string, partCode: string, filter: TableAndSizeFilter): Observable<Array<Material>>
  {
    var _resultArray = new Array<Material[]>();
    var result = new Subject<Array<Material>>();
    this._http
        .get(this.BASE_URL + "/" + groupCode)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray = new Array<Material>();
          for(var index = 0; index < res.length; index += 1)
          {
            resultArray.push(new Material(res[index].id, res[index].groupCode, res[index].partCode,
            res[index].commodityCode, res[index].description, res[index].description2));
          }
          result.next(resultArray);
        });
    return result.asObservable();
    /*
    var cacheKey = groupCode + "--------" + partCode;
    if (filter)
    {
      cacheKey += "--------" + filter.cacheKey;
    }
    var _resultArray = new Array<Material[]>();
    if (!this._store[cacheKey])
    {
      console.log('material-store.service - getAll - cacheKey: ' + cacheKey);//TODO: remove
    //TODO: replace with the actual implementation
    var _sampleMaterials: Material[] = [
      new Material(1, "GRP1", "PRT1", "G1P1343AFD33DSE", "Material with some nontrivial mocked description to check display settings"),
      new Material(2, "GRP1", "PRT1", "G1P1343AFD33DSE", "Material with some nontrivial mocked description to check display settings")
    ];
      this._store[cacheKey] = _sampleMaterials;
    }
    _resultArray.push(this._store[cacheKey]);
    return Observable.from(_resultArray);
    */
  }
}
