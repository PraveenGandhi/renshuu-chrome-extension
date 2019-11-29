import { Aurelia } from 'aurelia-framework';
import { App } from './services/app-service';

export class Login {

  static inject = [Aurelia, App];

  constructor(private aurelia: Aurelia, private app: App) {}

  public googleLogin() {
    this.app.login().then(() => {
      this.aurelia.setRoot('shells/app');
    }).catch(console.log);
  }
}
