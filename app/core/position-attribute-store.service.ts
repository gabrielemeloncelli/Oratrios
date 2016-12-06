import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { PositionAttribute } from './position-attribute';

@Injectable()
export class PositionAttributeStoreService{
  private BASE_URL = 'api/attributes';
  constructor(private _http: Http){}

  getAll(disciplineCode: string, projectCode: string): Observable<PositionAttribute[]>{

    var _resultArray = new Array<PositionAttribute[]>();
    var result = new Subject<Array<PositionAttribute>>();
    this._http
        .get(this.BASE_URL + "/attributes/" + disciplineCode + "/" + projectCode)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray: PositionAttribute[] = res.map((a: any) => new PositionAttribute(a.code, a.description, a.mandatory));
          result.next(resultArray);
        });
    return result.asObservable();
}

}
