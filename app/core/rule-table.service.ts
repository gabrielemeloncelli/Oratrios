import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { MappedTable } from './mapped-table';
import { RuleTable } from './rule-table';
import { RuleTableStoreService } from './rule-table-store.service';


@Injectable()
export class RuleTableService{
  private _tables: BehaviorSubject<Array<MappedTable>> = new BehaviorSubject(new Array<MappedTable>());
  public tables: Observable<Array<MappedTable>> = this._tables.asObservable();


  constructor(private _storeService: RuleTableStoreService){}


  getAll(groupCode: string, partCode: string)
  {
    this._storeService.getAll(groupCode, partCode).subscribe( tables =>
      {
        var mappedTables = new Array<MappedTable>();
        for(var tableIndex = 0; tableIndex < tables.length; tableIndex += 1)
        {
          mappedTables.push(new MappedTable(tables[tableIndex]));
        }
        this._tables.next(mappedTables);
      });
  }


}
