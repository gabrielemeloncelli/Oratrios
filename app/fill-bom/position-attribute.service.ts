import { Injectable }       from '@angular/core';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';
import { Observable }       from 'rxjs/Observable';

import { PositionAttributeStoreService }  from './position-attribute-store.service';
import { PositionAttribute }              from './position-attribute';

@Injectable()
export class PositionAttributeService{
  private _attributes: BehaviorSubject<Array<PositionAttribute>> = new BehaviorSubject(new Array<PositionAttribute>());
  public attributes: Observable<Array<PositionAttribute>> = this._attributes.asObservable();

  constructor(private _storeService: PositionAttributeStoreService) {
  }

  getAll(disciplineCode: string, projectCode: string){
    this._storeService.getAll(disciplineCode, projectCode)
      .subscribe(attrs => this._attributes.next(attrs));
  }

}
