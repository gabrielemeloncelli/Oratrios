import { Injectable } from '@angular/core';
import { Http , Response } from '@angular/http';
import { CommodityGroup } from './commodity-group';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/subject';

@Injectable()
export class CommodityGroupStoreService
{
  private BASE_URL : string = 'api/commoditygroups';

  constructor(private _http:Http){}

  getAll(disciplineCode: string): Observable<Array<CommodityGroup>>
  {
    var result = new Subject<Array<CommodityGroup>>();
    this._http
        .get(this.BASE_URL + "/" + disciplineCode)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray = new Array<CommodityGroup>();
          for(var index = 0; index < res.length; index += 1)
          {
            resultArray.push(new CommodityGroup(res[index].code, res[index].description));
          }
          result.next(resultArray);
        });
        return result.asObservable();
/*


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

  */
  }
}
