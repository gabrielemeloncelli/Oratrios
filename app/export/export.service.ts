import { Injectable }   from '@angular/core';
import { Http, Headers, RequestOptions }         from '@angular/http';

import { Observable }   from 'rxjs/observable';
import { Subject }      from 'rxjs/subject';

@Injectable()
export class ExportService
{
    private BASE_URL = 'api/export';
    constructor(private _http: Http){} 


    exportAll(projectDisciplineId: number): Observable<number>
    {
        console.log('export.service -- exportAll'); //TODO remove
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var result = new Subject<number>();
        this._http
            .get(this.BASE_URL + "/all/" + projectDisciplineId, options)
            .subscribe(res => {          
                result.next(0);
            });
        return result.asObservable();
    }
}