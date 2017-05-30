import { NgModule }     from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';



import { LoginComponent }       from './login.component';
import { LoginRoutingModule }   from './login-routing.module';
import { PlatformUserService }  from './platform-user.service';



@NgModule({
    imports: [ LoginRoutingModule,
                FormsModule,
                CommonModule,
                SharedModule ],
    declarations: [ LoginComponent ],
    providers: [ PlatformUserService ]
})
export class LoginModule{}