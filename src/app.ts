import { observable, Aurelia } from 'aurelia-framework';
import { App } from './services/app-service';

export class AppVM {

  public data = [];
  @observable type = '';
  public entity: any;
  
  static inject = [Aurelia, App];

  constructor(private aurelia: Aurelia, private app: App) {
    this.type = this.app.state.type;
  }
  
  activate() {
    this.app.loadWords();
  }

  toggleInvert() {
    this.setValue('theme', this.app.state.theme ? '': 'inverted');
  }
  
  typeChanged(newValue) {
    this.setValue('type', newValue);
  }

  private setValue(key: string, value: string) {
    if(key==='type' && !value) return;
    this.app.state[key] = value;
    localStorage.setItem('renshuu-app-state', JSON.stringify(this.app.state));
  }

  public submit() {
    this.app.saveWord(this.entity, ()=> {
      console.log("data has been inserted");
      console.log(this.entity); 
      this.app.loadWords(); 
    });
  }

  public logout() {
    this.app.logout().then(() => {
      this.aurelia.setRoot('login');
    }).catch((error: any) => {
      throw new Error(error);
    });
  }
}
export class FilterOnPropertyValueConverter  {
  toView(array: {}[], exp: string) {
    if (array === undefined || array === null || exp === undefined) {
        return array;
    }
    return array.filter((item) => {
      return this.hasValue(item['name'], exp) || 
      this.hasValue(item['meaning'], exp) || 
      this.hasValue(item['kana'], exp);
    });
  }

  hasValue(it, exp) {
    return it && it.toLowerCase().indexOf(exp.toLowerCase()) > -1;
  }
}