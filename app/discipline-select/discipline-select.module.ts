import { NgModule }         from '@angular/core';

import { CoreModule }                       from '../core/core.module';
import { DisciplineSelectComponent }        from './discipline-select.component';
import { DisciplineSelectRoutingModule }    from './discipline-select-routing.module';

@NgModule(
    {
        imports: [ CoreModule, DisciplineSelectRoutingModule ],
        declarations: [ DisciplineSelectComponent ]
    }
)
export class DisciplineSelectModule
{

}