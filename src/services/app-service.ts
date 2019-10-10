import * as firebase from './firebase';

export class App {

  public loadingMessage = "Logging In..!";
  public viewName = '';
  public colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black'];
  public state = {
    type: 'cards',
    theme: '',
    data: []
  };

  loadWords() :Promise<any> {
    const dbRef = firebase.default.database().ref('learning');
    return dbRef.once('value').then((snapshot) =>{
      let data = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
      this.state.data = data;
      this.state.data.forEach(it => it['color'] = this.colors.filter(c => c!=='black')[this.randomIntFromInterval()]);
      localStorage.setItem('renshuu-app-state', JSON.stringify(this.state));
    });
  }

  randomIntFromInterval(min = 0, max = this.colors.length - 2) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}