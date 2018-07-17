Module.module({
    name: 'addtext',
    scripts: [
        '/addtext.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view() {
        AddText.init();
        return AddText.view();
    }
});