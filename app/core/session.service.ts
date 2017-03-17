import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class SessionServiceConfig
{
  userLogin = 'donald';
  userIsAdministrator = false;
}

export class SessionUser
{
    login: string;
    isAdministrator: boolean;
}

@Injectable()
export class SessionService {
  private _userLogin = 'donald';
  private _userIsAdministrator = false;

  constructor(@Optional() config: SessionServiceConfig) {
    if (config)
    {
      this._userLogin = config.userLogin;
      this._userIsAdministrator = config.userIsAdministrator;
    }
  }

  get userLogin(): string {
    return this._userLogin;
  }

  get userIsAdministrator(): boolean {
    return this._userIsAdministrator;
  }


  get user(): Observable<SessionUser> {

    var innerUser: SessionUser = new SessionUser();
    innerUser.login = this._userLogin;
    innerUser.isAdministrator = this._userIsAdministrator;

    return Observable.from([innerUser]);
  }

}
