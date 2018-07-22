Module.module({
    name: 'login',
    scripts: [
        '/login.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        Login.init();
        return Login.view();
    }
});