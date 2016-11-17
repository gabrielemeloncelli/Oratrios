import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { RuleTable } from './rule-table';
import { RuleTableStoreService } from './rule-table-store.service';


@Injectable()
export class RuleTableService{
  private _tables: BehaviorSubject<Array<RuleTable>> = new BehaviorSubject(new Array<RuleTable>());
  public tables: Observable<Array<RuleTable>> = this._tables.asObservable();


  constructor(private _storeService: RuleTableStoreService){}


  getAll(groupCode: string, partCode: string)
  {
    this._storeService.getAll(groupCode, partCode).subscribe( tables => this._tables.next(tables));
  }


}
