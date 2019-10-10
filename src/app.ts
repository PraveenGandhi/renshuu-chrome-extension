import { autoinject, observable } from 'aurelia-framework';
import { App } from './services/app-service';

@autoinject()
export class AppVM {

  public data = [];
  @observable type = '';
  
  constructor(private app: App) {
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
    this.app.state[key] = value;
    localStorage.setItem('renshuu-app-state', JSON.stringify(this.app.state));
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