import { Aurelia } from 'aurelia-framework';
import { App } from './services/app-service';

export async function configure(aurelia: Aurelia) {

    const app: App = aurelia.container.get(App);
    let localState = localStorage.getItem('renshuu-app-state') || '';
    if (localState) {
        app.state = JSON.parse(localState);
    } else {
        localStorage.setItem('renshuu-app-state', JSON.stringify(app.state));
    }
    aurelia.use
        .standardConfiguration();

    await aurelia.start();
    aurelia.setRoot('app');
}