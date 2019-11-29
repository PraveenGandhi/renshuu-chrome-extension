import { Aurelia } from 'aurelia-framework';
import { App } from './services/app-service';

export class Login {
  private email:string;
  private password:string;

  static inject = [Aurelia, App];

  constructor(private aurelia: Aurelia, private app: App) {}

  async canActivate() {
    return new Promise((resolve) => {
      this.app.onUserChange(user => {
        if (user) {
          this.aurelia.setRoot('app');
        } else {
          resolve();
        }
      });
    });
  }

  googleLogin() {
    this.app.login().then(() => {
      this.aurelia.setRoot('shells/app');
    }).catch(console.log);
  }

  loginWithCred() {
    return this.app.loginWithCred(this.email, this.password);
  }
}
