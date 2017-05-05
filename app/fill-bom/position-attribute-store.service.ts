import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';
import { Attribute }      from './attribute';

@Injectable()
export class PositionAttributeStoreService{
  private BASE_URL = 'api/attributes';
  constructor(private _http: Http){}

  getAll(disciplineCode: string, projectCode: string): Observable<Attribute[]>{

    var _resultArray = new Array<Attribute[]>();
    var result = new Subject<Array<Attribute>>();
    this._http
        .get(this.BASE_URL + "/attributes/" + disciplineCode + "/" + projectCode)
        .map((res:Response) => res.json())
        .subscribe(res => {
          var resultArray: Attribute[] = res.map((a: any) => new Attribute(a.id, a.code, a.description, a.mandatory, a.maxlength,
          a.spmatId, a.forcedMandatory, a.disabled));
          result.next(resultArray);
        });
    return result.asObservable();
}

}
