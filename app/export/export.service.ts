import { Injectable }   from '@angular/core';
import { Http, Headers, RequestOptions }         from '@angular/http';

import { Observable }   from 'rxjs/Observable';
import { Subject }      from 'rxjs/Subject';

@Injectable()
export class ExportService
{
    private BASE_URL = 'api/export';
    constructor(private _http: Http){} 


    exportAll(projectDisciplineId: number): Observable<string>
    {
        console.log('export.service -- exportAll'); //TODO remove
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var result = new Subject<string>();
        this._http
            .get(this.BASE_URL + "/all/" + projectDisciplineId, options)
            .subscribe(res => {
                JSON.parse(res.text())
                console.log("export.service -- exportAll -- JSON.parse(res.text()).linkAddress: <" + JSON.parse(res.text()).linkAddress + ">");//TODO:remove         
                result.next(JSON.parse(res.text()).linkAddress);
            });
        return result.asObservable();
    }
}