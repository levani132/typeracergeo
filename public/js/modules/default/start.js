Module.module({
    name: 'default',
    scripts: [
        '/playground.js'
    ],
    onInit () {
        playGroundLoaded ();
        Router.openModule(this.name);
    },
    view() {
        return 'vaa';
    }
});