import { Aurelia } from 'aurelia-framework';
import firebase from './firebase';

export class App {

  private dbRef = firebase.default.database().ref('learning');
  public loadingMessage = "Logging In..!";
  public viewName = '';
  public colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black'];
  public state = {
    type: 'cards',
    theme: '',
    primaryColor: 'teal',
    loggedInUser: '',
    data: []
  };

  loadWords() :Promise<any> {
    return this.dbRef.once('value').then((snapshot) =>{
      let data = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
      this.state.data = data;
      this.state.data.forEach(it => it['color'] = this.colors.filter(c => c!=='black')[this.randomIntFromInterval()]);
      localStorage.setItem('renshuu-app-state', JSON.stringify(this.state));
    });
  }

  saveWord(word: any, cb: Function) {
    this.dbRef.child(word.name).set(word, cb);
  }

  authenticate(aurelia: Aurelia) {
    let localState = localStorage.getItem('renshuu-app-state') || '';
    if (localState) {
        this.state = JSON.parse(localState);
    }
    this.onUserChange((user: any) => {
      if (user) {
          let localState = localStorage.getItem('renshuu-app-state') || '';
          if (localState) {
              this.state = JSON.parse(localState);
              this.state.loggedInUser = user.displayName;
          } else {
            this.state.loggedInUser = user.displayName;
            localStorage.setItem('renshuu-app-state', JSON.stringify(this.state));
          }
          aurelia.setRoot('app');
      }else{
        this.state.loggedInUser = '';
        aurelia.setRoot('app');
      }
    });
  }

  public login() : Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  public loginWithCred(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public logout() : Promise<any> {
    return firebase.auth().signOut();
  }

  public onUserChange(cb: Function){
    firebase.auth().onAuthStateChanged(cb);
  }

  randomIntFromInterval(min = 0, max = this.colors.length - 2) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}