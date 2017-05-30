import { Component, OnInit } from '@angular/core';
//import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UiStatusService } from '../core/ui-status.service';

import { PlatformUserService }  from './platform-user.service';



@Component({
  selector: 'login',
  templateUrl: 'app/login/login.component.html',
  styleUrls: ['app/login/login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              public uiStatuService: UiStatusService,
              private platformUserService: PlatformUserService) { }

  //campi del form del login

  usernameLabel: string = "Username";
  password: string = "Password";
  rememberMe: string = "Remember Me";
  login: string = "BoM ELE - Manual BoM Electrical";
  signIn: string = "Sign-in";

  // username e password dell'utente se queste sono memorizzate nello storage
  //@Input() userInfo: any;
  // evento che restituisce l'esito della validazione in echo
  //@Output() isAuthorizated: EventEmitter<any> = new EventEmitter();


  //indica se l'utente ha passato o meno l'autenticazione
  isUserAuthorizated: boolean = false;
  // variabile in cui memorizzo lo username
  username: string;
  // variabile in cui memorizzo la password
  userPassword: string;
  // variabile in cui memorizzo se l'utente voglia o meno essere ricordato nei prossimi accessi
  userRememberMe: boolean;
  // flag per la gestione del login durante la fase di autorizzazione
  loading: boolean;


  ngOnInit() {
    this.loading = false;
    // Get the username of the user autehenticated by the platform
    this.platformUserService.platformUser.subscribe(user => this.uiStatuService.platformAuthenticatedUserName = user.code);
    this.platformUserService.getUser();
    //this.username = (this.userInfo != null) ? this.userInfo.username : "";
    //this.userPassword = (this.userInfo != null) ? this.userInfo.password : "";
    //this.userRememberMe = (this.userInfo != null) ? this.userInfo.rememberMe : false;

  }

  public SignIn() {
/*
    this.loading = true;
    var elesStorageCredentials = this.localSt.retrieve("ElesStorageCredentials");
    if (elesStorageCredentials != null) {
      elesStorageCredentials.rememberMe = this.userRememberMe;
      this.localSt.store("ElesStorageCredentials", elesStorageCredentials)
    }

    this.echoAuthenticationService.authorizeWithEcho(this.username, this.userPassword, this.userRememberMe)
      .subscribe(
      res => {// se la validazione è andata a buon fine viene restituito il token
        let authenticatedUser = res;
        // se l'autorizzazione è andata a buon fine imposto a true la variabile per entrare nell'applicativo
        if (authenticatedUser != null) {
          this.isUserAuthorizated = true;
          this.router.navigateByUrl('/');
          this.loading = false;

          var loginResult: any = {
            username: this.username,
            isUserAuthorizated: this.isUserAuthorizated
          }
          this.isAuthorizated.emit(loginResult);

        }
      },
      error => {
        this.toasterService.pop("error", "Anauthorizated user or crediantial wrong");
        var loginResult: any = {
          username: this.username,
          isUserAuthorizated: this.isUserAuthorizated
        }
        this.isAuthorizated.emit(loginResult);
        this.loading = false;

      }
      );
*/
  }


}
