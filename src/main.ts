import { Aurelia } from 'aurelia-framework';
import { App } from './services/app-service';

declare var FuseBox: any;

export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature('resources/index');
    if (FuseBox.import('process').env.devMode) {
        aurelia.use.developmentLogging();
    }
    await aurelia.start();

    const app: App = aurelia.container.get(App);
    await app.authenticate(aurelia)
}