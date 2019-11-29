const { RawPlugin,FuseBox, HTMLPlugin,CSSPlugin, EnvPlugin, TerserPlugin, WebIndexPlugin } = require("fuse-box");
const { src, task } = require("fuse-box/sparky");
var TypeHelper = require('fuse-box-typechecker').TypeHelper
var autoLoadAureliaLoaders =function() {
    class loader {
        constructor() { }
        init(context) { }
        bundleEnd(context) {
            context.source.addContent(`FuseBox.import("fuse-box-aurelia-loader")`);
            context.source.addContent(`FuseBox.import("aurelia-bootstrapper")`);
        }
    }
    return new loader();
}
task('typechecker', () => {
    var testWatch = TypeHelper({
        tsConfig: './tsconfig.json',
        name: 'Seed',
        basePath: './',
        tsLint: './tslint.json',
        shortenFilenames: true,
        yellowOnLint: true,
    })
    testWatch.runWatch('./src')
    return true;
});
let run = (production) => {
    let env = {
        FB_AU_LOG: !production,
        devMode: !production
    }
    const fuse = FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        target:"browser@es6",
        runAllMatchedPlugins: true,
        plugins: [
            autoLoadAureliaLoaders(),
            production && TerserPlugin(),
            CSSPlugin(),
            EnvPlugin(env),
            HTMLPlugin(),
            RawPlugin(['.css', '.woff','.png']),
            WebIndexPlugin({template:'./index.html'})
        ]
    });
    fuse.register('firebase-app', {
        homeDir: 'node_modules/firebase/app/dist',
        main: 'index.cjs.js',
        instructions: '+index.cjs.js'
    });
    fuse.register('firebase-auth', {
        homeDir: 'node_modules/firebase/auth/dist',
        main: 'index.cjs.js',
        instructions: '+index.cjs.js'
    });
    fuse.register('firebase-firestore', {
        homeDir: 'node_modules/firebase/database/dist',
        main: 'index.cjs.js',
        instructions: '+index.cjs.js'
    });
    fuse.bundle("vendor")
        .cache(true)
        .instructions(`
        + fuse-box-css
        + firebase-app
        + firebase-auth
        + firebase-firestore
        + fuse-box-aurelia-loader
        + aurelia-bootstrapper
        + aurelia-fetch-client
        + aurelia-framework
        + aurelia-pal-browser
        + aurelia-logging-console
        + aurelia-templating-binding
        + aurelia-templating-resources
        + aurelia-event-aggregator
        + aurelia-history-browser
        + aurelia-templating-router`);
    if (!production) {
        fuse.bundle('app')
            .watch().hmr({reload : true})
            .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `);
        fuse.dev();

    } else {
        fuse.bundle('app')
            .watch()
            .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `);
        fuse.dev();
    }
    fuse.run();
};
task('clean', async () => await src('dist/*').clean('dist').exec());
task('copy', async () => {
  await src("**/**.**", { base: "static" }).dest('./dist/').exec();
});
task("dev",  ['clean','copy'
//, 'typechecker'
], () => run(false));
task("prod", ['clean','copy'], () => run(true));