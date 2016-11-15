import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from './select/select';
import { HightlightPipe } from './select/select-pipes'
@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ Select, HightlightPipe ],
  exports:      [ Select ],
  providers:    [ ]
})
export class SelectModule {  }
