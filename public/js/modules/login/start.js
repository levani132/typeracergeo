Module.module({
    name: 'login',
    scripts: [
        '/login.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        Header.disable();
        Layout.disable();
        return Login.view();
    }
});