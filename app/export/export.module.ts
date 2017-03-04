import { NgModule } from '@angular/core';

import { ExportComponent }      from './export.component';
import { ExportService }        from './export.service';
import { ExportRoutingModule }  from './export-routing.module';

@NgModule(
    {
        imports: [ ExportRoutingModule ],
        declarations: [ ExportComponent ],
        providers: [ ExportService ]
    }
)
export class ExportModule
{

}