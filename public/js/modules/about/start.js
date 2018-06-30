Module.module({
    name: 'about',
    scripts: [
        '/about.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view() {
        return 'about';
    }
});