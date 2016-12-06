import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable } from 'rxjs/observable';
import { Material } from './material';
import { TableAndSizeFilter } from './table-and-size-filter';
import { MaterialStoreService } from './material-store.service';

@Injectable()
export class MaterialService{
  private _materials: BehaviorSubject<Array<Material>> = new BehaviorSubject(new Array<Material>());
  public materials: Observable<Array<Material>> = this._materials.asObservable();


constructor(private _storeService: MaterialStoreService){}

  getSingle(materialId: number)
  {
    this._storeService.getSingle(materialId).subscribe( materials => this._materials.next(materials));
  }
  getAll(disciplineCode: string, groupCode: string, partCode: string, filter: TableAndSizeFilter)
  {
    this._storeService.getAll(disciplineCode, groupCode, partCode, filter).subscribe( materials => this._materials.next(materials));
  }

  clear()
  {
    this._materials.next(new Array<Material>());
  }




}
