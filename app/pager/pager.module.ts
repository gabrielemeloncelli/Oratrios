import { NgModule }         from '@angular/core';

import { PagerService }     from './pager.service';
import { PagerComponent }   from './pager.component';


@NgModule({
  imports:      [ ],
  declarations: [ PagerComponent ],
  exports:      [ PagerComponent ],
  providers:    [ PagerService ]
})
export class PagerModule {

  constructor () {

  }

}
