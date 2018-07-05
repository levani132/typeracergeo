Module.module({
    name: 'texts',
    scripts: [
        '/texts.js',
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        return Texts.view();
    }
});