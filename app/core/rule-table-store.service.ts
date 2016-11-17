import { Injectable } from '@angular/core';
import { RuleTable } from './rule-table';
import { Observable } from 'rxjs/Observable';
import { RuleTableDetail } from './rule-table-detail';


@Injectable()
export class RuleTableStoreService
{
  private _store: RuleTable[][] = new Array<RuleTable[]>();
  getAll(groupCode: string, partCode: string): Observable<Array<RuleTable>>
  {
    var _resultArray = new Array<RuleTable[]>();
    if (!this._store[groupCode + '---------' + partCode])
    {
    //TODO: replace with the actual implementation
    var mockDetails: RuleTableDetail[] = [
      {detail: "DET1", description: "Detail 1 description"},
      {detail: "DET2", description: "Detail 2 description"},
      {detail: "DET3", description: "Detail 3 description"},
      {detail: "DET4", description: "Detail 4 description"}
    ];
    var _sampleRules: RuleTable[] = [
      {name: "TABLE_1", description: "Table 1", details: mockDetails},
      {name: "TABLE_2", description: "Table 2", details: mockDetails}
    ];
      this._store[groupCode + '---------' + partCode] = _sampleRules;
    }
    _resultArray.push(this._store[groupCode + '---------' + partCode]);
    return Observable.from(_resultArray);
  }
}
